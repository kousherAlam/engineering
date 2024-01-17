import { Profiler } from "winston";
import { ILoggersModuleProp } from "./logs.types";

interface LoggerData {
  context: string;
  uuid: string;
  moduleInfo: ILoggersModuleProp;
}

export class Logger {
  private _meta: Map<string, any> = new Map();
  private _errorCount: number = 0;
  constructor(
    private readonly profiler: Profiler,
    private data: LoggerData,
  ) {}

  addMeta(key: string, value: any) {
    this._meta.set(key, value);
  }

  rmMeta(key: string) {
    this._meta.delete(key);
  }

  debug(message: string) {
    this.profiler.logger.debug(message, {
      context: this.data.context,
      uuid: this.data.uuid,
    });
    return this;
  }

  info(message: string) {
    this.profiler.logger.info(message, {
      context: this.data.context,
      uuid: this.data.uuid,
    });
    return this;
  }

  warn(message: string) {
    this.profiler.logger.warn(message, {
      context: this.data.context,
      uuid: this.data.uuid,
    });
    return this;
  }

  error(message: string) {
    this._errorCount++;
    this.profiler.logger.error(message, {
      context: this.data.context,
      uuid: this.data.uuid,
    });
    return this;
  }

  done(message?: string) {
    const errorMessage = this._errorCount > 0 ? `Completed with ${this._errorCount} error.` : "Completed";

    this.profiler.done({
      message: message ? message : errorMessage,
      context: this.data.context,
      uuid: this.data.uuid,
    });
  }
}
