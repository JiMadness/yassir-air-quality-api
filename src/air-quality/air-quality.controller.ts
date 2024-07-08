import { Controller, Get, Query } from '@nestjs/common';
import { AirQualityService } from './air-quality/air-quality.service';
import { AirQuality } from './air-quality/types/air-quality.type';
import { GetAirQualityDto } from './dto/get-air-quality.dto';
import { ParisAirQualityService } from './paris-air-quality/paris-air-quality.service';

@Controller('air-quality')
export class AirQualityController {
  constructor(
    private readonly airQualityService: AirQualityService,
    private readonly parisAirQualityService: ParisAirQualityService,
  ) {}

  @Get()
  async getAirQuality(
    @Query() coordinates: GetAirQualityDto,
  ): Promise<AirQuality> {
    return this.airQualityService.getAirQualityForCoordinates(coordinates);
  }

  @Get('paris/most-polluted/ts')
  async getDateTimeWhenParisMostPolluted(): Promise<{ ts: string }> {
    return this.parisAirQualityService.getDateTimeWhenMostPolluted();
  }
}
