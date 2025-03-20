import { Module } from '@nestjs/common';

import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({})
export class EnvModule {
  static register(appName?: string) {
    const envs = ['.env.local', '.env'];
    const envFilePath = appName ? [appName].map(name => `apps/${name.toLocaleLowerCase()}/.env`).concat(envs) : envs;

    return {
      module: EnvModule,
      imports: [
        ConfigModule.forRoot({
          envFilePath: process.env.NODE_ENV === 'production' ? undefined : envFilePath,
        }),
      ],
      providers: [ConfigService],
      exports: [ConfigService],
    };
  }
}
