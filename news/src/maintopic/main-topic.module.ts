import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MainTopicSchema } from './main-topic.schema';
import { MainTopicService } from './main-topic.service';
import { MainTopicController } from './main-topic.controller';
import { CronJobService } from './cron.job.service';
import { DB_MAINTOPIC } from './constants';

@Module({
    imports: [MongooseModule.forFeature([{ name: DB_MAINTOPIC, schema: MainTopicSchema }])],
    controllers: [MainTopicController],
    providers: [MainTopicService,CronJobService],
    exports:[MainTopicService]
})
export class Maintopicmodule { }
