import { registerAs } from '@nestjs/config';
import { Level } from 'pino';

export const LoggerConfig = registerAs('loggerConfig', () => {
  return {
    level: process.env.LOG_LEVEL as Level,
    pretty: process.env.LOG_PRETTY,
  };
});

export default LoggerConfig;
