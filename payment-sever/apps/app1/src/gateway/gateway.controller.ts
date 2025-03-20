import { Body, Controller, Get, Post } from '@nestjs/common';

import { PaymentType } from '@components/checkout/enums/payment-type.enum';
import { PaymentProcessorType } from '@components/checkout/payment-processors/payment-processor-type.enum';
import { StripePaymentInput } from '@components/checkout/stripe/dto/stripe-payment.input';

import { GatewayService } from './gateway.service';

@Controller()
export class GatewayController {
  constructor(private readonly gatewayService: GatewayService) {}

  @Get('pay-test')
  payTest() {
    return this.gatewayService.pay({
      amount: 100,
      currency: 'USD',
      payments: [
        {
          paymentType: PaymentType.CARD,
          processorType: PaymentProcessorType.CARD_STRIPE,
          amount: 100,
          currency: 'USD',
          confirmationTokenId: 'test',
        } as StripePaymentInput,
      ],
    });
  }

  @Post('pay')
  // TODO: create a DTO
  pay(@Body() payment: any) {
    return this.gatewayService.pay(payment);
  }
}
