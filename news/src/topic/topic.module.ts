import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TopicController } from './topic.controller';
import { TopicService } from './topic.service';
import { TopicSchema } from './topic.schema';
import { MainTopicSchema } from 'src/maintopic/main-topic.schema';
import { CronJobService } from './cron.job.service';
import { DB_TOPIC } from './constants';
import { DB_MAINTOPIC } from 'src/maintopic/constants';
import { Maintopicmodule } from 'src/maintopic/main-topic.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: DB_TOPIC, schema: TopicSchema }]),
    Maintopicmodule,
  ],
  controllers: [TopicController],
  providers: [TopicService, CronJobService],
  exports: [TopicService],
})
export class Topicmodule {}
