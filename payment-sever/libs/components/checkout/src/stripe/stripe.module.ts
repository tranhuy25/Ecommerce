import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { LoggerModule } from '@app/logger';

import { StripeService } from './stripe.service';
import { StripeConfig } from './stripe.config';

@Module({
  imports: [LoggerModule, ConfigModule.forFeature(StripeConfig)],
  providers: [StripeService],
  exports: [StripeService],
})
export class StripeModule {}
