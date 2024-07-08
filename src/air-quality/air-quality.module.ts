import { Module } from '@nestjs/common';
import { AirQualityController } from './air-quality.controller';
import { AirQualityProviderService } from './air-quality-provider/air-quality-provider.service';
import { AirQualityService } from './air-quality/air-quality.service';
import { HttpModule } from '@nestjs/axios';
import { ParisAirQualityJobService } from './paris-air-quality/paris-air-quality-job.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  AirQualityForParis,
  AirQualityForParisSchema,
} from './schemas/air-quality-for-paris.schema';
import { ParisAirQualityService } from './paris-air-quality/paris-air-quality.service';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([
      { name: AirQualityForParis.name, schema: AirQualityForParisSchema },
    ]),
  ],
  controllers: [AirQualityController],
  providers: [
    AirQualityProviderService,
    AirQualityService,
    ParisAirQualityJobService,
    ParisAirQualityService,
  ],
})
export class AirQualityModule {}
