
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { mainTopics } from './main-topic.schema';
import fetch from 'node-fetch-commonjs';
import * as cheerio from 'cheerio';
import { DB_MAINTOPIC } from './constants';

@Injectable()
export class MainTopicService {
    constructor(@InjectModel(DB_MAINTOPIC) private readonly mainTopicModel: Model<mainTopics>) { }
    async crawlAndSaveMainTopics() {
        const url = 'https://vnexpress.net/';
        try {
            const response = await fetch(url);
            const html = await response.text();
            const $ = cheerio.load(html);

            const mainTopic = [];
            const dtoList = [
                'https://video.vnexpress.net/?_gl=1*13hmc2*_gcl_au*MTY1NjAxOTE2MC4xNjk2NzgxNjYz',
                'https://vnexpress.net/goc-nhin',
                'https://vnexpress.nethttps://video.vnexpress.net'
            ];
            $('.main-nav .parent li').each((_index, element) => {
                const name = $(element).find('a').text().replace(/\n\n+/g, '').trim();
                const DtoLink = 'https://vnexpress.net';
                const link = DtoLink+$(element).find('a').attr('href').replace(/,/, '');

                if (!dtoList.includes(link)) {
                    console.log("???1", name, link);
                    mainTopic.push({ name, link });
                }
                for (const item of mainTopic) {
                    const existingLinks =  this.mainTopicModel.exists({ link: item.link });
                    if (existingLinks) {
                        console.log("Dữ liệu đã tồn tại ")
                    }else {
                         this.mainTopicModel.insertMany(mainTopic)
                        console.log("Dữ liệu đã được lưu vào csdl")
                    }
                }               
            })
        } catch (error) {
            console.error('Lỗi: ', error);
        }
    }
    async find() {
        return await this.mainTopicModel.find().exec();
    }
}
