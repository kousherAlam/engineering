import { BaseConfigSchema } from "@libs/types";
import { z } from "zod";

export const EnvVariableSchema = BaseConfigSchema.extend({
  DATABASE: z.object({
    HOST_URL: z
      .string()
      .url("Host must contain a valid url.")
      .includes(":", { message: "please specify port." }),
    DB_NAME: z.string().min(2),
    DB_USER: z.string().min(4),
    PASSWORD: z.string().min(4),
  }),
  SWAGGER_PATH: z.string().default("swagger"),
  API_PREFIX: z.string().default("api"),
});
//
export type EnvironmentVariables = z.infer<typeof EnvVariableSchema>;
