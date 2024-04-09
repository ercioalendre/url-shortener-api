import { NestFactory } from '@nestjs/core';
import { AppModule } from '@src';
import { Logger, ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter, PrismaExceptionFilter } from '@common/filters';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import compression = require('compression');
import cluster from 'node:cluster';
import os from 'node:os';
import { setupGracefulShutdown } from 'nestjs-graceful-shutdown';
import { AppConfig } from '@config';
import * as Sentry from '@sentry/node';

const logger = new Logger('Main');

async function bootstrap() {
  if (AppConfig.getOrThrow('USE_NODE_CLUSTER') === 'false') {
    await runServer();
  } else {
    if (cluster.isPrimary) {
      const numCores = os.cpus().length;

      logger.log(
        `Starting the application in cluster mode with ${numCores} workers.`,
      );

      for (let i = 0; i < numCores; i++) {
        cluster.fork();
      }

      cluster.on('exit', (worker, code, signal) => {
        if (code !== 0 && !worker.exitedAfterDisconnect) {
          logger.warn(
            `Worker with process id ${worker.process.pid} has been disconnected with code ${code} and signal ${signal}. Creating a new one...`,
          );

          cluster.fork();
        }
      });
    } else {
      await runServer();
    }
  }

  async function runServer() {
    logger.log(`Process running under ID ${process.pid}`);

    const app = await NestFactory.create(AppModule);

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );

    const sentryDsnUrl = AppConfig.get('SENTRY_DSN_URL');

    if (sentryDsnUrl) {
      Sentry.init({
        dsn: sentryDsnUrl,
      });
    }

    app.useGlobalFilters(new HttpExceptionFilter());

    app.useGlobalFilters(new PrismaExceptionFilter());

    const config = new DocumentBuilder()
      .setTitle('System API Docs')
      .setDescription('The system API documentation.')
      .setVersion('1.0')
      .build();

    const document = SwaggerModule.createDocument(app, config);

    SwaggerModule.setup('api-docs', app, document);

    app.enableCors({
      origin: '*',
    });

    app.use(
      compression({
        filter: () => {
          return true;
        },
        threshold: 0,
      }),
    );

    setupGracefulShutdown({
      app,
    });

    await app.listen(AppConfig.get('PORT') || 3000);
  }
}

bootstrap();
