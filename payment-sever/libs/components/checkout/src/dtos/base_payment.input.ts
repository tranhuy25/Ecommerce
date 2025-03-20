import { IsPositive } from 'class-validator';

import { PaymentProcessorType } from '../payment-processors/payment-processor-type.enum';
import { PaymentType } from '../enums/payment-type.enum';

export abstract class BasePaymentInput {
  processorType?: PaymentProcessorType;

  @IsPositive()
  amount: number;

  currency: string;

  paymentType: PaymentType;
}
