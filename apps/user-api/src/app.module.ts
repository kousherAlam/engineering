import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule } from "@libs/logger";
import { UsersModule } from './users/users.module';
import configuration from "./utility/configuration/load";
import { MongooseModule } from '@nestjs/mongoose';
import { EnvironmentVariables } from './utility';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService<EnvironmentVariables>) => {
        const dbConfig = config.get("DATABASE", { infer: true });
        return {
          uri: `mongodb://${dbConfig.HOST_URL}`,
          user: dbConfig.DB_USER,
          pass: dbConfig.PASSWORD,
          dbName: dbConfig.DB_NAME,
          retryAttempts: 5,
          retryDelay: 1000,
        }
      },
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    LoggerModule.forRootAsync({
      isGlobal: true,
      useFactory: async () => {
        return {
          AppName: "Backend",
          NODE_ENV: "dev",
          logLevel: "debug",
        };
      },
      inject: [],
    }),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
