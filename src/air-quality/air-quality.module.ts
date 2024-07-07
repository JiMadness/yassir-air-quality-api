import { Module } from '@nestjs/common';
import { AirQualityController } from './air-quality.controller';
import { AirQualityProviderService } from './air-quality-provider/air-quality-provider.service';
import { AirQualityService } from './air-quality/air-quality.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [AirQualityController],
  providers: [AirQualityProviderService, AirQualityService],
})
export class AirQualityModule {}
