import { Logger, LoggerService } from '@app/logger';
import { Injectable } from '@nestjs/common';

import { PaymentType } from '../enums/payment-type.enum';
import { PaymentProcessorType } from './payment-processor-type.enum';
import { PaymentProcessor } from './processors/payment.processor';
import { StripeCardPaymentProcessor } from './processors/stripe-card-payment.processor';
import { CustomVoucherPaymentProcessor } from './processors/custom-voucher-payment.processor';

@Injectable()
export class PaymentProcessorsService {
  private logger: Logger;

  constructor(
    private readonly loggerService: LoggerService,
    private readonly stripeCardPaymentProcessor: StripeCardPaymentProcessor,
    private readonly customVoucherPaymentProcessor: CustomVoucherPaymentProcessor,
  ) {
    this.logger = this.loggerService.getLogger(PaymentProcessorsService.name);
  }

  getProcessor(paymentType: PaymentType, processorType?: PaymentProcessorType): PaymentProcessor {
    switch (paymentType) {
      case PaymentType.CARD:
        switch (processorType) {
          case PaymentProcessorType.CARD_STRIPE:
            return this.stripeCardPaymentProcessor;
          default:
            throw new Error(`No payment provider found for processor type: ${processorType}`);
        }
      case PaymentType.VOUCHER:
        switch (processorType) {
          case PaymentProcessorType.CUSTOM_VOUCHER:
            return this.customVoucherPaymentProcessor;
          default:
            throw new Error(`No payment provider found for processor type: ${processorType}`);
        }
      default:
        throw new Error(`No payment provider found for payment type: ${paymentType}`);
    }
  }
}
