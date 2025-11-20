import winston, { Logger } from 'winston';

const logger: Logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  defaultMeta: { service: 'payment-service' },
  transports: [
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      maxsize: 5242880,
      maxFiles: 5,
    }),
    new winston.transports.File({
      filename: 'logs/combined.log',
      maxsize: 5242880,
      maxFiles: 5,
    }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.errors({ stack: true }),
        winston.format.printf((info: Record<string, unknown>) => {
          const { level, message, timestamp, stack, ...metadata } = info;
          let msg = `${timestamp} [${level}] : ${message}`;

          if (stack) msg += `\n${stack}`;

          if (Object.keys(metadata).length > 0 && metadata.service === undefined) {
            msg += ` ${JSON.stringify(metadata, null, 2)}`;
          }

          return msg;
        })
      ),
    })
  );
}

export const stream = {
  write: (message: string) => {
    logger.info(message.trim());
  },
};

export default logger;
