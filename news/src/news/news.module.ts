
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CronJobService } from './cron.job.service';
import { NewsController } from './news.controller';
import { NewsSchema } from './news.schema';
import { NewsService } from './news.service';
import { DB_NEW } from './constants';
import { Topicmodule } from 'src/topic/topic.module';

@Module({
    imports: [MongooseModule.forFeature([{ name: DB_NEW, schema: NewsSchema }]), Topicmodule],
    controllers: [NewsController],
    providers: [NewsService, CronJobService,],
    exports:[NewsService],
})
export class NewsModule { }
