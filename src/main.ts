import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConsoleLogger, ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import { HttpExceptionFilter } from './utils/filters/http-exception.filter';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const logger = new ConsoleLogger('FinApp', {
    timestamp: true,
    logLevels: ['log', 'error', 'warn', 'debug', 'verbose'],
  });

  const app = await NestFactory.create(AppModule, { logger });

  const config = new DocumentBuilder()
    .setTitle('Fin app')
    .setDescription('API documentation for finance app')
    .setVersion('1.0')
    .addTag('categories')
    .addTag('expenses')
    .addTag('auth')
    .addTag('statistics')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'jwt-access',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  const configService = app.get(ConfigService);
  app.use(
    session({
      secret: configService.get<string>('JWT_ACCESS_SECRET'),
      resave: false,
      saveUninitialized: false,
      cookie: { secure: false },
    }),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  app.use(cookieParser());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.enableCors({
    origin: 'http://localhost:3030',
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
