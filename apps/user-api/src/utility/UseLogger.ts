import { ExecutionContext, createParamDecorator } from "@nestjs/common";
import { CustomRequest } from "./CustomRequest";

export const UseLogger = createParamDecorator((_: string, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<CustomRequest>();
  return request.logger;
});
