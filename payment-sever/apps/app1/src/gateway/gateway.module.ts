import { Module } from '@nestjs/common';

import { LoggerModule } from '@app/logger';
import { CheckoutModule } from 'libs/components/checkout/src';

import { GatewayController } from './gateway.controller';
import { GatewayService } from './gateway.service';

@Module({
  imports: [LoggerModule, CheckoutModule],
  controllers: [GatewayController],
  providers: [GatewayService],
})
export class GatewayModule {}
