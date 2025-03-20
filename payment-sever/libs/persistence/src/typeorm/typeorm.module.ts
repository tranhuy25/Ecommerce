import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { TypeOrmFactory } from './typeorm.factory.service';

@Module({
  imports: [ConfigModule],
  providers: [TypeOrmFactory],
  exports: [TypeOrmFactory],
})
export class TypeOrmModule { }
