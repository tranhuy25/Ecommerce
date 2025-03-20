import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

import { PersistenceFactory } from '../persistence.factory.interface';

@Injectable()
export class TypeOrmFactory
  implements PersistenceFactory<TypeOrmModuleOptions> {
  constructor(private configService: ConfigService) { }

  async create(dbName: string) {
    return this._pgSettings(dbName);
  }

  private _pgSettings(name: string): TypeOrmModuleOptions {
    const typeOrmConfig: TypeOrmModuleOptions = {
      ...this._getEnvs(name),
      type: 'postgres' as const,
      autoLoadEntities: true,
      synchronize: false,
      migrationsRun: false,
      entities: [__dirname + '../../../**/*.entity{.ts,.js}'],
    };

    return typeOrmConfig;
  }

  private _getEnvs(dbName: string) {
    return {
      host: this.configService.getOrThrow(`${dbName}.HOST`),
      port: parseInt(this.configService.getOrThrow(`${dbName}.PORT`), 10),
      username: this.configService.getOrThrow(`${dbName}.USERNAME`),
      password: this.configService.getOrThrow(`${dbName}.PASSWORD`),
      database: this.configService.getOrThrow(`${dbName}.DATABASE`),
      logging: !!this.configService.getOrThrow(`${dbName}.LOGGING`),
    };
  }
}
