import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import stripe from 'stripe';

import { Logger, LoggerService } from '@app/logger';

import { StripeConfig } from './stripe.config';

@Injectable()
export class StripeService {
  private logger: Logger;
  private stripe: stripe;

  constructor(
    private readonly loggerService: LoggerService,
    @Inject(StripeConfig.KEY)
    private readonly stripeConfig: ConfigType<typeof StripeConfig>,
  ) {
    this.logger = this.loggerService.getLogger(StripeService.name);

    this.stripe = new stripe(this.stripeConfig.secretKey, {
      apiVersion: this.stripeConfig.apiVersion as '2024-12-18.acacia',
    });
  }

  async createPaymentIntent({ confirmationTokenId, amount, currency }: { confirmationTokenId: string; amount: number; currency: string }) {
    try {
      const intent = await this.stripe.paymentIntents.create({
        confirm: true,
        amount,
        currency,
        automatic_payment_methods: { enabled: true, allow_redirects: 'never' },
        confirmation_token: confirmationTokenId,
      });

      return intent;
    } catch (err: any) {
      throw new Error(err.message);
    }
  }
}
