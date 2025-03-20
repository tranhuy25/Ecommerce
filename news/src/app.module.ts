import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { Maintopicmodule } from './maintopic/main-topic.module';
import { Topicmodule } from './topic/topic.module';
import { NewsModule } from './news/news.module'
import { ConfigModule, ConfigService } from '@nestjs/config';
import { config } from './config/configuration';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal:true,
    load :[config],
  }),
  MongooseModule.forRootAsync({
    inject:[ConfigService],
    useFactory:async (configSecret:ConfigService) =>({
      uri:configSecret.get('mongoUri'),
    })
  }),
    Maintopicmodule, Topicmodule,NewsModule,ScheduleModule.forRoot()],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule { }




