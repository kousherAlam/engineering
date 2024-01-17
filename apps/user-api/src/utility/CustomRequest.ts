import { Logger } from "@libs/logger";
import { Request } from "express";

export interface CustomRequest extends Request {
  logger?: Logger;
}
