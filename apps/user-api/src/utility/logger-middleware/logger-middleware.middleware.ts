import { LoggerService } from "@libs/logger";
import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Response } from "express";
import { CustomRequest } from "../CustomRequest";

@Injectable()
export class LoggerMiddlewareMiddleware implements NestMiddleware {
  constructor(private readonly logger: LoggerService) { }

  use(request: CustomRequest, response: Response, next: NextFunction): void {
    const { ip, method } = request;
    const url = request.originalUrl;
    const userAgent = request.get("user-agent") || "";
    const uuid: string = (request.headers["x-request-id"] as string) || crypto.randomUUID();
    const logger = this.logger.init(
      `(Started) [${method}] ${url} - ${userAgent} IP=${ip}`,
      url,
      uuid,
    );

    //* DO NOT REMOVE THE CODE
    //!ASSING LOGGER IN THE REQUEST OBJECT (IMPORTANT)
    request.logger = logger;

    // When request is comppleted.
    response.on("close", () => {
      const { statusCode } = response;
      const contentLength = response.get("content-length");
      if (statusCode >= 200 && statusCode <= 204) {
        logger.error(`Error happend`);
      }
      logger.done(`Completed with Status=${statusCode} Length=${contentLength}`);
    });

    next();
  }
}
