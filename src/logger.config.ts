import { createLogger, format, transports } from 'winston';

const { combine, timestamp, errors, printf, json } = format;

const customFormat = printf(({ timestamp, level, message, stack }) => {
  return `${timestamp} - [${level.toUpperCase().padEnd(7)}] - ${stack || message}`;
});

const options = {
  fileError: {
    filename: 'logs/error.log',
    level: 'error',
    handleExceptions: true,
  },
  fileCombined: {
    filename: 'logs/combined.log',
    level: 'info',
    handleExceptions: true,
  },
  console: {
    level: 'debug',
    handleExceptions: true,
  },
};

const devLogger = {
  level: 'debug',
  format: combine(timestamp(), errors({ stack: true }), customFormat),
  transports: [new transports.Console(options.console)],
};

const prodLogger = {
  level: 'info',
  format: combine(timestamp(), errors({ stack: true }), json()),
  transports: [
    new transports.File(options.fileError),
    new transports.File(options.fileCombined),
    new transports.Console(options.console),
  ],
};

export const instance = createLogger({
  ...(process.env.NODE_ENV === 'production' ? prodLogger : devLogger),
  exitOnError: false, 
});
