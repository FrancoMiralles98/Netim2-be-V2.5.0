import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { ApiResponseInterceptor } from './modules/shared/interceptors/api-response.interceptor';
import { ApiExceptionFilter } from './modules/shared/filters/api-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: process.env.URL_FRONT,
    credentials: true,
  });
  
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
