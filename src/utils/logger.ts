import winston, { Logger } from "winston";

interface LogInfo {
  level: string;
  message: string;
  timestamp?: string;
  [key: string]: any;
}

const logger: Logger = winston.createLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  format: winston.format.combine(
    winston.format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  defaultMeta: { service: "payment-service" },
  transports: [
    // Write all logs with importance level of 'error' or less to 'error.log'
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    // Write all logs with importance level of 'info' or less to 'combined.log'
    new winston.transports.File({
      filename: "logs/combined.log",
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
  ],
});

// If we're not in production then log to the console with custom format
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.errors({ stack: true }),
        winston.format.printf((info) => {
          const { level, message, timestamp, stack, ...metadata } = info;
          let msg = `${timestamp} [${level}] : ${message}`;

          // Add stack trace if available
          if (stack) {
            msg += `\n${stack}`;
          }

          if (
            Object.keys(metadata).length > 0 &&
            metadata.service === undefined
          ) {
            msg += ` ${JSON.stringify(metadata, null, 2)}`;
          }
          return msg;
        })
      ),
    })
  );
}

// Create a stream object with a write function that will be used by Morgan
export const stream = {
  write: (message: string) => {
    logger.info(message.trim());
  },
};

export default logger;