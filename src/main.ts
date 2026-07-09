import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser = require('cookie-parser')
import { ApiResponseInterceptor } from './modules/shared/interceptors/api-response.interceptor';
import { ApiExceptionFilter } from './modules/shared/filters/api-exception.filter';
import { NodeEnv } from './config/types/node-env.enum';
import morgan = require('morgan');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: process.env.URL_FRONT,
    credentials: true,
  });

  if (process.env.NODE_ENV === NodeEnv.DEVELOPMENT) {
    app.use(morgan('dev'))
  }

  app.use(cookieParser())
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true
  }))

  app.useGlobalInterceptors(new ApiResponseInterceptor())
  app.useGlobalFilters(new ApiExceptionFilter())

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
