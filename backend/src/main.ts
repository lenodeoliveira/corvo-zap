import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { enableSwagger } from './docs/swagger';
import { ConsoleLogger, ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './shared/infra/http/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new ConsoleLogger({
      prefix: 'corvo-zap',
     // json: true,
    }),
  });

  app.useGlobalFilters(new HttpExceptionFilter())

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Enable automatic transformation
      whitelist: true, // Optional: removes properties not defined in the DTO
      forbidNonWhitelisted: true, // Optional: throws an error if non-whitelisted properties are present
    }),
  );

  enableSwagger(app)

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();