import { Injectable } from '@nestjs/common';
import { Coordinates } from '../types/coordinates.type';
import { AirQuality } from './types/air-quality.type';
import { AirQualityProviderService } from '../air-quality-provider/air-quality-provider.service';
import { AirQualityProviderResponse } from './types/air-quality-provider-response.type';

@Injectable()
export class AirQualityService {
  constructor(
    private readonly airQualityProviderService: AirQualityProviderService,
  ) {}

  async getAirQualityForCoordinates(
    coordinates: Coordinates,
  ): Promise<AirQuality> {
    const providerResponse: AirQualityProviderResponse =
      await this.airQualityProviderService.getAirQuality(coordinates);

    return this.getAirQualityFromProviderResponse(providerResponse);
  }

  private getAirQualityFromProviderResponse(
    providerResponse: AirQualityProviderResponse,
  ): AirQuality {
    return {
      Result: {
        Pollution: providerResponse.data.current.pollution,
      },
    };
  }
}
