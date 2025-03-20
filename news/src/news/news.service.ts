import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as cheerio from 'cheerio';
import { Model } from 'mongoose';
import fetch from 'node-fetch-commonjs';
import { news } from './news.schema';
import { DB_NEW } from './constants';
import { TopicService } from 'src/topic/topic.service';

@Injectable()
export class NewsService {
    constructor(
        @InjectModel(DB_NEW) private readonly newsModel: Model<news>,
        private readonly topicService: TopicService
    ) { }

    async crawlAndSaveNews() {
        const topicdto = await this.topicService.find();

        for (const topic of topicdto) {
            const url = topic.link;
            console.log(url)
            try {
                const response = await fetch(url);
                const html = await response.text();
                const $ = cheerio.load(html);

                const newsList = [];
                $('.list-news-subfolder .item-news').each((_index, element) => {
                    const dto = $(element).find('.description a').first().attr();
                    const description =$(element).find('p.description').text().replace(/\n\n+/g, '').trim();
                    const link = dto.href
                    const title = dto.title
                    newsList.push({ title, link ,description}); 
                }); 
                let newlistdto = await newsList.map(async newsItem => {
                    const Url = newsItem.link;
                    const response = await fetch(Url);
                    const html = await response.text();
                    const $ = cheerio.load(html);
                    $('.page-detail .sidebar-1').each((_index, element) => {
                        const Atl={
                        thumbnail :$(element).find('.fck_detail .tplCaption img.lazy').attr('src'),
                        content :$(element).find('.fck_detail p.Normal').text().replace(/\n\n+/g, '').trim(),
                        createdAt : $(element).find('.header-content span.date').text().replace(/\n\n+/g, '').trim(),
                        }
                        newsItem= {...Atl,...newsItem}
                    });
                    return newsItem
                });
                 newlistdto=await Promise.all(newlistdto)
                console.log("-------",newlistdto)
            
                for (const item of newsList) {
                    const existingLinks = await this.newsModel.exists({ link: item.link });
                    if (existingLinks) {
                        console.log("------Tin tức đã tồn tại trong cơ sở dữ liệu-------")
                    } else {
                        await this.newsModel.insertMany(newlistdto)
                        console.log("-------Tin tức đã được lưu vào cở sở dữ liệu---------")
                    }
                }               
            } catch (error) {
                console.error('Lỗi: ', error);
            }
        }
    }
    async getAll() {
       return this.newsModel.find()
    }
}
