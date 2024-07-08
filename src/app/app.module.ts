import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AirQualityModule } from '../air-quality/air-quality.module';
import { ScheduleModule } from '@nestjs/schedule';
import { MongooseModule } from '@nestjs/mongoose';
import { EnvironmentVariables } from '../types/environment-variables.type';
import { LoggerModule } from 'nestjs-pino';

@Module({
  imports: [
    LoggerModule.forRoot(),
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<EnvironmentVariables>) => ({
        uri: configService.get<string>('MONGO_URI'),
      }),
    }),
    ScheduleModule.forRoot(),
    AirQualityModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
