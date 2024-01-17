import { LoggerMiddlewareMiddleware } from "./logger-middleware.middleware";

describe("LoggerMiddlewareMiddleware", () => {
  it("should be defined", () => {
    expect(new LoggerMiddlewareMiddleware()).toBeDefined();
  });
});
