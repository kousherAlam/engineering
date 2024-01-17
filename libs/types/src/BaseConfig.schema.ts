import { z } from "zod";
import { EnvSchema } from "./Env.schema";

export const BaseConfigSchema = z.object({
  NODE_ENV: EnvSchema,
  PORT: z.number().default(Math.floor(Math.random() * 1000) + 7000),
  NAME: z.string().default("[SERVICE-NAME]"),
  VERSION: z.string().default("0.0.0"),
  API_VERSION_PREFIX: z.string().default("v"),
  API_PREFIX: z.string().default("/api/"),
  SWAGGER_PATH: z.string().default("swagger"),
  DESCRIPTION: z.string().default("PROVIDE-DESCRIPTION"),
});
