import { Injectable } from '@nestjs/common';

import { Logger, LoggerService } from '@app/logger';
import { CheckoutService } from '@components/checkout/checkout.service';

@Injectable()
export class GatewayService {
  private readonly logger: Logger;

  constructor(
    private readonly loggerService: LoggerService,
    private readonly checkoutService: CheckoutService,
  ) {
    this.logger = this.loggerService.getLogger(GatewayService.name);
  }

  async pay(payment: any) {
    const response = await this.checkoutService.processPayments(payment);

    return response;
  }
}
