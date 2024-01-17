import { z } from "zod";

export const EnvSchema = z.enum(["dev", "uat", "prod"]).default("dev");

export type NODE_ENV = z.infer<typeof EnvSchema>;

