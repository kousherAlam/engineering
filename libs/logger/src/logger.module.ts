import { DynamicModule, Module } from "@nestjs/common";
import { WinstonModule } from "nest-winston";
import { getWinstonLogOptions } from "./getWinstonLogOptions";
import { LoggerService } from "./logger.service";
import { LOGS_MODULE_OPTIONS } from "./logs.constant";
import { ILoggersModuleProp, LoggerAsyncOptions } from "./logs.types";

@Module({})
export class LoggerModule {
  static forRootAsync(options: LoggerAsyncOptions): DynamicModule {
    return {
      module: LoggerModule,
      global: options.isGlobal,
      imports: [
        WinstonModule.forRootAsync({
          useFactory: (config: ILoggersModuleProp) => {
            return getWinstonLogOptions(config);
          },
          inject: [LOGS_MODULE_OPTIONS],
        }),
      ],
      providers: [
        {
          provide: LOGS_MODULE_OPTIONS,
          useFactory: async (...args: any[]) => await options.useFactory(...args),
          inject: options.inject || [],
        },
        LoggerService,
      ],
      exports: [LoggerService, LOGS_MODULE_OPTIONS],
    };
  }

  static forRoot(options: ILoggersModuleProp): DynamicModule {
    return {
      module: LoggerModule,
      global: true,
      imports: [WinstonModule.forRoot(getWinstonLogOptions(options))],
      providers: [
        LoggerService,
        {
          provide: LOGS_MODULE_OPTIONS,
          useValue: options,
        },
      ],
      exports: [LoggerService, LOGS_MODULE_OPTIONS],
    };
  }
}
