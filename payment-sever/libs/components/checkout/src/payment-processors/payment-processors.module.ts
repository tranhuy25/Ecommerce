import { Module } from '@nestjs/common';

import { LoggerModule } from '@app/logger';

import { PaymentLogModule } from '../payment-log/payment-log.module';
import { StripeModule } from '../stripe/stripe.module';
import { PaymentProcessorsService } from './payment-processors.service';
import { StripeCardPaymentProcessor } from './processors/stripe-card-payment.processor';
import { CustomVoucherPaymentProcessor } from './processors/custom-voucher-payment.processor';

@Module({
  imports: [LoggerModule, PaymentLogModule, StripeModule],
  providers: [
    PaymentProcessorsService, //
    StripeCardPaymentProcessor,
    CustomVoucherPaymentProcessor,
  ],
  exports: [PaymentProcessorsService],
})
export class PaymentProcessorsModule {}
