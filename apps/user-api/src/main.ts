import { LoggerModule, LoggerService, WINSTON_MODULE_NEST_PROVIDER } from '@libs/logger';
import { StandardizeResponseInterceptor } from '@libs/std';
import { VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { patchNestJsSwagger } from 'nestjs-zod';
import { AppModule } from './app.module';
import { EnvironmentVariables } from './utility/configuration/environment-variables';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: false,
    autoFlushLogs: false,
    forceCloseConnections: true,
    logger: LoggerModule.createLogger({ AppName: '', NODE_ENV: 'prod' })
  });
  const config = app.get(ConfigService<EnvironmentVariables>);
  const prefix = config.get('API_PREFIX');
  const swaggerPath = config.get('SWAGGER_PATH');
  const port = config.get('PORT', { infer: true });
  const env = config.get('NODE_ENV', { infer: true });

  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  app.use(helmet());
  app.setGlobalPrefix(prefix);
  app.enableCors();
  app.enableShutdownHooks();
  app.useGlobalInterceptors(new StandardizeResponseInterceptor());
  app.enableVersioning({
    type: VersioningType.URI,
    prefix: config.get('API_VERSION_PREFIX'),
  });

  const logger = app
    .get(LoggerService)
    .init('Server is starting...', bootstrap.name, crypto.randomUUID());

  if (env === 'dev') {
    patchNestJsSwagger();
    const swaggerConfig = new DocumentBuilder()
      .setTitle(config.get('NAME'))
      .setVersion(config.get('VERSION'))
      .setDescription(config.get('DESCRIPTION'))
      .build();
    const swaggerDoc = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup(swaggerPath, app, swaggerDoc);
    logger.done(`Swagger running on http://localhost:${port}/${swaggerPath}`);
  }

  await app.listen(port);
  logger.done(`Server running on http://localhost:${port}/${prefix}`);
}
bootstrap();
