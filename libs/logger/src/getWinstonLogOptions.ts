import { LoggerOptions, format, transports } from "winston";
import { ILoggersModuleProp, defaultLogLevel } from "./logs.types";

export function getWinstonLogOptions(config: ILoggersModuleProp): LoggerOptions {
  return {
    transports: [
      new transports.Console({
        level: config.logLevel ? config.logLevel : defaultLogLevel(config.NODE_ENV),
        format: format.combine(
          format.timestamp(),
          format.ms(),
          format.json({
            bigint: true,
          }),
        ),
      }),
    ],
  };
}
