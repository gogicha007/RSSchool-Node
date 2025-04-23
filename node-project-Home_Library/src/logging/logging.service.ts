import { ConsoleLogger, Injectable } from '@nestjs/common';
import * as fs from 'node:fs';
import { promises as fsPromises } from 'node:fs';
import * as path from 'node:path';
import { LogLevel } from '@nestjs/common/services/logger.service';
import {
  MAX_LOG_LEVEL,
  DEFAULT_LOG_LEVEL,
  LOG_LEVELS,
} from 'src/app.constants';

@Injectable()
export class LoggingService extends ConsoleLogger {
  constructor(context?: string) {
    super(context);
    this.setLogLevels(
      LoggingService.getLogLevel(
        (process.env.LOG_LEVEL ?? DEFAULT_LOG_LEVEL) as string,
      ),
    );
  }

  async logToFile(level: string, entry: any) {
    const formattedEntry = `${Intl.DateTimeFormat('en-US', {
      dateStyle: 'short',
      timeStyle: 'short',
      timeZone: 'Asia/Tbilisi',
    }).format(new Date())}\t${entry}\n`;

    const logsDir = path.join(__dirname, '..', '..', 'logs');

    try {
      if (!fs.existsSync(logsDir)) {
        await fsPromises.mkdir(logsDir);
      }
      const logFName = 'logs.log';
      const errFName = 'errors.log';
      const fileName = path.join(
        logsDir,
        level !== 'error' ? logFName : errFName,
      );

      if (fs.existsSync(fileName)) {
        const stats = await fsPromises.stat(fileName);
        if (
          stats.size + Buffer.byteLength(entry) >=
          +process.env.LOG_MAX_FILE_SIZE
        ) {
          const logArc = `${new Date().getTime()}.${level}`;
          await fsPromises.copyFile(fileName, path.join(logsDir, logArc));
          await fsPromises.truncate(fileName);
        }
      }

      await fsPromises.appendFile(fileName, formattedEntry);
    } catch (e) {
      if (e instanceof Error) console.error(e.message);
    }
  }

  /**
   * Write a 'log' level log.
   */
  log(message: any, context?: string) {
    const entry = `log: ${message}\t${context ? context : ''}`;
    this.logToFile('log', entry);
    super.log(message, context);
  }

  /**
   * Write an 'error' level log.
   */
  error(message: any, stackOrContext?: string) {
    const entry = `error: ${stackOrContext ? stackOrContext : ''}\t${message}`;
    this.logToFile('error', entry);
    super.error(message, stackOrContext);
  }

  /**
   * Write a 'warn' level log.
   */
  warn(message: any) {
    const entry = `warn: ${message}`;
    this.logToFile('warn', entry);
    super.warn(message);
  }

  /**
   * Write a 'debug' level log.
   */
  debug(message: any) {
    const entry = `debug: ${message}`;
    this.logToFile('debug', entry);
    super.warn(message);
  }

  /**
   * Write a 'verbose' level log.
   */
  verbose(message: any) {
    const entry = `verbose: ${message}`;
    this.logToFile('warn', entry);
    super.verbose(message);
  }

  static objectToString(object: unknown): string {
    return Object.keys(object).reduce(
      (result, param, index) =>
        `${result}${param}: ${object[param]}${
          Object.keys(object).length - 1 === index ? ' }' : ', '
        }`,
      '{ ',
    );
  }

  static getLogLevel(level: string): LogLevel[] {
    if (+level > MAX_LOG_LEVEL) {
      throw new Error('Invalid log level argument');
    }

    return LOG_LEVELS.slice(0, +level);
  }
}
