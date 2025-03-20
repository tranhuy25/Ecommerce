/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';

import { LoggerService } from '@app/logger';
import { PaymentLogService } from 'libs/components/checkout/src/payment-log/payment-log.service';

import { PaymentLog } from '@components/checkout/payment-log/payment-log.entity';
import { StripeService } from 'libs/components/checkout/src/stripe/stripe.service';
import { PaymentTransactionFailedResult, PaymentTransactionResult } from '../payment-processor.interfaces';
import { PaymentProcessor } from './payment.processor';

@Injectable()
export class CustomVoucherPaymentProcessor extends PaymentProcessor {
  constructor(
    protected readonly loggerService: LoggerService,
    protected readonly paymentLogService: PaymentLogService,
    protected readonly stripeService: StripeService,
  ) {
    super(loggerService, paymentLogService);
  }

  protected async _pay(): Promise<PaymentTransactionResult> {
    return {
      result: {
        message: 'Payment completed successfully',
      },
    };
  }

  protected async _refund(paymentLog: PaymentLog): Promise<PaymentTransactionFailedResult> {
    return {
      message: 'Payment refunded successfully',
    };
  }
}
