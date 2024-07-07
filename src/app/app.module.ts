import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AirQualityModule } from '../air-quality/air-quality.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), AirQualityModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
