import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LoggerModule } from '@app/logger';

import { PaymentLog } from './payment-log.entity';
import { PaymentLogService } from './payment-log.service';

@Module({
  imports: [LoggerModule, TypeOrmModule.forFeature([PaymentLog])],
  providers: [PaymentLogService],
  exports: [PaymentLogService],
})
export class PaymentLogModule {}
