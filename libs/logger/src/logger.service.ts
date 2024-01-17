// import { Injectable } from '@nestjs/common';

// @Injectable()
// export class LoggerService {}

import { Inject, Injectable } from "@nestjs/common";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Logger as WinstonLogger } from "winston";
import { Logger } from "./Logger";
import { LOGS_MODULE_OPTIONS } from "./logs.constant";
import { type ILoggersModuleProp } from "./logs.types";

@Injectable()
export class LoggerService {
    constructor(
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: WinstonLogger,
        @Inject(LOGS_MODULE_OPTIONS)
        private readonly logsData: ILoggersModuleProp,
    ) { }

    init(message: string, context: string, uuid: string = crypto.randomUUID()) {
        const meta = { uuid, context };
        const profiler = this.logger.info(message, meta).startTimer();
        return new Logger(profiler, { context, uuid, moduleInfo: this.logsData });
    }
}
