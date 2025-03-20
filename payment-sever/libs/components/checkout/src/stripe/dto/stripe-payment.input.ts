import { BasePaymentInput } from 'libs/components/checkout/src/dtos/base_payment.input';
import { PaymentType } from '@components/checkout/enums/payment-type.enum';
import { PaymentProcessorType } from '@components/checkout/payment-processors/payment-processor-type.enum';

export class StripePaymentInput extends BasePaymentInput {
  confirmationTokenId: string;

  processorType = PaymentProcessorType.CARD_STRIPE;
  paymentType = PaymentType.CARD;
}
