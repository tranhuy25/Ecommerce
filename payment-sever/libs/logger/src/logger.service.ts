import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';

import LoggerConfig from './logger.config';
import { PinoService } from './pino/pino.service';
import { Logger, PinoLoggerOptions } from './pino/pino.interface';

@Injectable()
export class LoggerService {
  constructor(
    @Inject(LoggerConfig.KEY)
    private readonly loggerConfiguration: ConfigType<typeof LoggerConfig>,
  ) {}

  getLogger(name: string, options?: PinoLoggerOptions): Logger {
    const pinoOptions = { ...options, ...this.loggerConfiguration };
    return new PinoService(name, pinoOptions);
  }
}
