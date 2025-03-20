import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule as NestTypeOrmModule } from '@nestjs/typeorm';

import { TypeOrmFactory } from './typeorm/typeorm.factory.service';
import { TypeOrmModule } from './typeorm/typeorm.module';

@Module({})
export class PersistenceModule {
  static registerTypeOrm(database: string | string[]): DynamicModule {
    const databases = Array.isArray(database) ? database : [database];

    return {
      module: PersistenceModule,
      imports: [
        ...databases.map(name =>
          NestTypeOrmModule.forRootAsync({
            imports: [TypeOrmModule],
            inject: [TypeOrmFactory],
            useFactory: async (typeOrmFactory: TypeOrmFactory) => {
              const configOptions = await typeOrmFactory.create(name);

              return configOptions;
            },
          }),
        ),
      ],
    };
  }
}
