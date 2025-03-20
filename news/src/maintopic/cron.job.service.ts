import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { MainTopicService } from './main-topic.service';


@Injectable()
export class CronJobService {
  constructor(private maintopicService: MainTopicService) {}

  @Cron(CronExpression.EVERY_10_SECONDS)
  handleCron() {
    const currentTime = new Date().toLocaleTimeString();
    console.log(`Cron Job is running at ${currentTime}`);
       return this.maintopicService.crawlAndSaveMainTopics();
  }
}
