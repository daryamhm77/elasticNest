import { createLogger, format, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { inspect } from 'util';

const customFormat = format.printf(
  ({ timestamp, level, message, stack, ...metadata }) => {
    let msg = `${timestamp} [${level.toUpperCase().padEnd(7)}] `;

    if (typeof message === 'object') {
      msg += inspect(message, { depth: null, colors: false });
    } else {
      msg += message;
    }

    if (stack) {
      msg += `\n${stack}`;
    }

    if (metadata && Object.keys(metadata).length > 0) {
      msg += `\n${inspect(metadata, { depth: null, colors: false })}`;
    }

    return msg;
  },
);

const transportOptions = {
  json: false,
  handleExceptions: true,
  handleRejections: true,
  maxsize: 5242880, // 5MB
  maxFiles: 5,
};

const isProduction = process.env.NODE_ENV === 'production';

const loggerConfig = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    verbose: 4,
    debug: 5,
    silly: 6,
  },
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.errors({ stack: true }),
    format.metadata({ fillExcept: ['message', 'level', 'timestamp', 'stack'] }),
    isProduction ? format.json() : customFormat,
  ),
  transports: [
    new DailyRotateFile({
      ...transportOptions,
      level: 'error',
      filename: 'logs/error-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
    }),
    new DailyRotateFile({
      ...transportOptions,
      level: 'info',
      filename: 'logs/combined-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
    }),
    new transports.Console({
      level: isProduction ? 'info' : 'silly',
      handleExceptions: true,
      format: format.combine(format.colorize(), customFormat),
    }),
  ],
  exceptionHandlers: [
    new DailyRotateFile({
      ...transportOptions,
      filename: 'logs/exceptions-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
    }),
  ],
  exitOnError: false,
};

const logger = createLogger(loggerConfig);

export default logger;
