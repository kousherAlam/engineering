import { EnvSchema } from "@libs/types";
import * as pack from "../../../../../package.json";
import { EnvironmentVariables, EnvVariableSchema } from "./environment-variables";

export default () => {
  const configs: Partial<EnvironmentVariables> = {
    NODE_ENV: EnvSchema.parse(process.env.NODE_ENV),
    PORT: parseInt(process.env.PORT, 10),
    NAME: process.env.NAME || "user-api",
    VERSION: pack.version,
    DESCRIPTION: pack.description,
    DATABASE: {
      HOST_URL: process.env.HOST_URL,
      DB_NAME: process.env.DB_NAME,
      DB_USER: process.env.DB_USER,
      PASSWORD: process.env.PASSWORD,
    },
  };
  return EnvVariableSchema.parse(configs);
};
