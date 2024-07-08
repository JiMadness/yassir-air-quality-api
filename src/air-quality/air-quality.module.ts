import { Module } from '@nestjs/common';
import { AirQualityController } from './air-quality.controller';
import { AirQualityProviderService } from './air-quality-provider/air-quality-provider.service';
import { AirQualityService } from './air-quality/air-quality.service';
import { HttpModule } from '@nestjs/axios';
import { ParisAirQualityJobService } from './paris-air-quality-job/paris-air-quality-job.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  AirQualityForParis,
  AirQualityForParisSchema,
} from './schemas/air-quality-for-paris.schema';

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
  ],
})
export class AirQualityModule {}
