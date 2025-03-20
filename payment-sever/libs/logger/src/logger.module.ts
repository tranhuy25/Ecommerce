import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import LoggerConfig from './logger.config';
import { LoggerService } from './logger.service';

@Module({
  imports: [ConfigModule.forFeature(LoggerConfig)],
  providers: [LoggerService],
  exports: [LoggerService],
})
export class LoggerModule {}
