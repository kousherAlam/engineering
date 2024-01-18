import { EnvSchema } from '@libs/types';
import * as pack from '../../../../../package.json';
import {
  EnvironmentVariables,
  EnvVariableSchema,
} from './environment-variables';

export default () => {
  const configs: Partial<EnvironmentVariables> = {
    NODE_ENV: EnvSchema.parse(process.env.NODE_ENV),
    PORT: parseInt(process.env.PORT, 10),
    NAME: process.env.NAME || 'user-api',
    VERSION: pack.version,
    DESCRIPTION: pack.description,
    DATABASE: {
      MONGODB_HOST: process.env.MONGODB_HOST,
      MONGODB_DBNAME: process.env.MONGODB_DBNAME,
      MONGODB_USER: process.env.MONGODB_USER,
      MONGODB_PASSWORD: process.env.MONGODB_PASSWORD,
    },
    REDIS: {
      REDIS_HOST: process.env.REDIS_HOST,
      REDIS_PORT: parseInt(process.env.REDIS_PORT, 10),
      REDIS_PASSWORD: process.env.REDIS_PASSWORD,
      REDIS_USER: process.env.REDIS_USER,
    },
  };
  return EnvVariableSchema.parse(configs);
};
