import { Controller, Get, Query } from '@nestjs/common';
import { AirQualityService } from './air-quality/air-quality.service';
import { AirQuality } from './air-quality/types/air-quality.type';
import { GetAirQualityDto } from './dto/get-air-quality.dto';

@Controller('air-quality')
export class AirQualityController {
  constructor(private readonly airQualityService: AirQualityService) {}

  @Get()
  async getAirQuality(
    @Query() coordinates: GetAirQualityDto,
  ): Promise<AirQuality> {
    return this.airQualityService.getAirQualityForCoordinates(coordinates);
  }
}
