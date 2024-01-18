import { BaseConfigSchema } from '@libs/types';
import { z } from 'zod';

export const EnvVariableSchema = BaseConfigSchema.extend({
  DATABASE: z.object({
    MONGODB_HOST: z
      .string()
      .url('Host must contain a valid url.')
      .includes(':', { message: 'please specify port.' }),
    MONGODB_DBNAME: z.string().min(2),
    MONGODB_USER: z.string().min(4),
    MONGODB_PASSWORD: z.string().min(4),
  }),
  REDIS: z.object({
    REDIS_HOST: z.string(),
    REDIS_PORT: z.number(),
    REDIS_PASSWORD: z.string().optional(),
    REDIS_USER: z.string().optional(),
  }),
  SWAGGER_PATH: z.string().default('swagger'),
  API_PREFIX: z.string().default('api'),
});
//
export type EnvironmentVariables = z.infer<typeof EnvVariableSchema>;
