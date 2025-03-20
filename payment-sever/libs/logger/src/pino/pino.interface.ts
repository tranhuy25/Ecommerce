import { LoggerService } from '@nestjs/common';
import { Level } from 'pino';

export interface PinoLoggerOptions {
  level: Level;
  pretty: string;
}

export interface Logger extends LoggerService {
  log(message: string, ...args: any[]): void;
  error(message: string, ...args: any[]): void;
  warn(message: string, ...args: any[]): void;
  debug(message: string, ...args: any[]): void;
}
