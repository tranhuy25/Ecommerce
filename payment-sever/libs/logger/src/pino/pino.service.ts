import { Injectable } from '@nestjs/common';
import pino from 'pino';

import { Logger, PinoLoggerOptions } from './pino.interface';

@Injectable()
export class PinoService implements Logger {
  private readonly logger: pino.Logger;

  constructor(name: string, options: PinoLoggerOptions) {
    const { pretty, level } = options;

    this.logger = pino({
      name,
      level,
      transport: {
        target: pretty == 'true' ? 'pino-pretty' : undefined,
      },
    });
  }

  log(message: string, ...args: any[]) {
    this.logger.info(message, ...args);
  }

  error(message: string, ...args: any[]) {
    this.logger.error(message, ...args);
  }

  warn(message: string, ...args: any[]) {
    this.logger.warn(message, ...args);
  }

  debug(message: string, ...args: any[]) {
    this.logger.debug(message, ...args);
  }
}
