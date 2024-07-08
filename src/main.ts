import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from './types/environment-variables.type';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const configService: ConfigService<EnvironmentVariables> =
    app.get(ConfigService);
  const port = configService.get<number>('PORT');
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  app.useLogger(app.get(Logger));
  app.useGlobalInterceptors(new LoggerErrorInterceptor());

  await app.listen(port);
}
bootstrap();
