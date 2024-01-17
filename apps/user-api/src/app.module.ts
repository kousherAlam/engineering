import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule } from '@libs/logger';
import { UsersModule } from './users/users.module';
import configuration from './utility/configuration/load';
import { MongooseModule } from '@nestjs/mongoose';
import { EnvironmentVariables } from './utility';
import type { RedisClientOptions } from 'redis';
import { redisStore } from 'cache-manager-redis-store';
import {
  CacheInterceptor,
  CacheModule,
  CacheStore,
} from '@nestjs/cache-manager';
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ZodValidationPipe } from 'nestjs-zod';

@Module({
  imports: [
    CacheModule.registerAsync<RedisClientOptions>({
      imports: [ConfigModule],
      isGlobal: true,
      useFactory: async (config: ConfigService<EnvironmentVariables>) => {
        const redisConfig = config.get('REDIS', { infer: true });
        const store = await redisStore({
          socket: {
            host: redisConfig.REDIS_HOST,
            port: redisConfig.REDIS_PORT,
          },
          // url: `local:redis:6379`,
          username: redisConfig.REDIS_USER ?? undefined,
          password: redisConfig.REDIS_PASSWORD ?? undefined,
          ttl: 60 * 60 * 24, // 24 hour of caching in seconds
        });

        return {
          store: store as unknown as CacheStore,
        };
      },
      inject: [ConfigService],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService<EnvironmentVariables>) => {
        const dbConfig = config.get('DATABASE', { infer: true });
        return {
          uri: `mongodb://${dbConfig.HOST_URL}`,
          user: dbConfig.DB_USER,
          pass: dbConfig.PASSWORD,
          dbName: dbConfig.DB_NAME,
          retryAttempts: 5,
          retryDelay: 1000,
        };
      },
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    LoggerModule.forRootAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: async (config: ConfigService<EnvironmentVariables>) => {
        return {
          AppName: config.get('NAME'),
          NODE_ENV: config.get('NODE_ENV'),
          logLevel: 'debug',
        };
      },
      inject: [ConfigService],
    }),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
})
export class AppModule { }
