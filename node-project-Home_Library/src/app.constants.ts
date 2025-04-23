import { LogLevel } from '@nestjs/common/services/logger.service';

export const NOT_FOUND_INDEX = -1;
export const CONTENT_TYPE = 'application/json';
export const NO_CONTENT_STATUS_CODE = 204;
export const LOG_LEVELS: LogLevel[] = [
  'error',
  'warn',
  'log',
  'debug',
  'verbose',
];
export const MAX_LOG_LEVEL = 5;
export const DEFAULT_LOG_LEVEL = 5;
