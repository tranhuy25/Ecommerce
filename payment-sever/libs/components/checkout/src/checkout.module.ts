import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LoggerModule } from '@app/logger';

import { PaymentLogModule } from './payment-log/payment-log.module';
import { Checkout } from './checkout.entity';
import { CheckoutService } from './checkout.service';
import { PaymentProcessorsModule } from './payment-processors/payment-processors.module';

@Module({
  imports: [TypeOrmModule.forFeature([Checkout]), LoggerModule, PaymentLogModule, PaymentProcessorsModule],
  providers: [CheckoutService],
  exports: [CheckoutService],
})
export class CheckoutModule {}
