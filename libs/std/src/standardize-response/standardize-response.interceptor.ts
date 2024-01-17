import { ApiResponse } from "@libs/types";
import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { Request, Response } from "express";
import { ZodIssue } from "nestjs-zod/z";
import { Observable, catchError, map, throwError } from "rxjs";

@Injectable()
export class StandardizeResponseInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((res: unknown) => this.responseHandler(res, context)),
      catchError((err: HttpException) => throwError(() => this.errorHandler(err, context))),
    );
  }

  errorHandler(exception: HttpException, context: ExecutionContext) {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    return response.status(status).json({
      ok: false,
      statusCode: status,
      url: request.url,
      message: exception.message,
      data: this.getErrData(exception),
    } as ApiResponse<any>);
  }

  private getErrData(exception: HttpException) {
    if (!(exception instanceof HttpException)) {
      return exception;
    }
    const errorRspns = exception.getResponse();
    if (typeof errorRspns === "string") {
      return {
        error: errorRspns,
      };
    } else if (errorRspns && errorRspns["errors"]) {
      return this.generateErrorMessages(errorRspns["errors"]);
    }
    return {
      error: "Unknown error",
    };
  }

  private generateErrorMessages(errors: ZodIssue[]) {
    const final: any[] = [];
    errors.forEach((err) => {
      const path = err.path.reduce((prev, current) => `${prev} > ${current}`);
      final.push({
        message: err.message,
        path,
        code: err.code,
      });
    });
    return final;
  }

  responseHandler(res: any, context: ExecutionContext) {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const statusCode = response.statusCode;

    return {
      ok: true,
      message: `Success`,
      url: request.url,
      statusCode,
      data: res,
    } as ApiResponse<any>;
  }
}
