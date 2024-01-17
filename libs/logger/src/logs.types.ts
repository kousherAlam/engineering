import { NODE_ENV } from "@libs/types";
import { InjectionToken, ModuleMetadata, OptionalFactoryDependency } from "@nestjs/common";

const LogLevel = {
  emerg: 0,
  alert: 1,
  crit: 2,
  error: 3,
  warning: 4,
  notice: 5,
  info: 6,
  debug: 7,
};

export type LogLevel = keyof typeof LogLevel;

export interface ILoggersModuleProp {
  AppName: string;
  NODE_ENV: NODE_ENV;
  logLevel?: LogLevel;
}

export interface LoggerAsyncOptions extends Pick<ModuleMetadata, "imports"> {
  useFactory: (...args: any[]) => Promise<ILoggersModuleProp>;
  inject: (InjectionToken | OptionalFactoryDependency)[];
  isGlobal?: boolean;
}

export function defaultLogLevel(env: NODE_ENV): LogLevel {
  return env === "dev" ? "debug" : "info";
}
