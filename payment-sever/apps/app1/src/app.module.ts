import { Module } from '@nestjs/common';

import { LoggerModule } from '@app/logger';
import { EnvModule } from '@libs/env';
import { PersistenceModule } from '@libs/persistence';
import { DevtoolsModule } from '@nestjs/devtools-integration';

import { GatewayModule } from './gateway/gateway.module';

const app = 'APP1';

@Module({
  imports: [
    LoggerModule,
    DevtoolsModule.register({
      http: process.env.NODE_ENV !== 'production',
      port: 8000,
    }),
    EnvModule.register(app),
    PersistenceModule.registerTypeOrm(app),
    GatewayModule,
  ],
})
export class AppModule { }
