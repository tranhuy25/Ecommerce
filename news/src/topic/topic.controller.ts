
import { Controller, Get, Post } from '@nestjs/common';
import { TopicService } from './topic.service';

@Controller('news')
export class TopicController {
    constructor(private readonly topicService: TopicService) {}

    @Get('crawl-and-save')
    async crawlAndSaveNews() {
        await this.topicService.crawlAndSaveTopics();
        return { message: 'Crawl và lưu tin tức thành công!' };
    }
    // @Post("test")
    // async testCrawl (){
    //    return this.topicService.getAll()
    // }
}
