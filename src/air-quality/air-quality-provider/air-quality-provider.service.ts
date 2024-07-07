import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Coordinates } from '../types/coordinates.type';
import { firstValueFrom } from 'rxjs';
import { AirQualityAPIResponse } from './types/air-quality-api-response.type';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from '../../types/environment-variables.type';

@Injectable()
export class AirQualityProviderService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService<EnvironmentVariables>,
  ) {}

  async getAirQuality(
    coordinates: Coordinates,
  ): Promise<AirQualityAPIResponse> {
    const providerURL = this.getCompleteProviderURL(coordinates);

    const { data } = await firstValueFrom(
      this.httpService.get<AirQualityAPIResponse>(providerURL),
    );

    return data;
  }

  private getCompleteProviderURL(coordinates: Coordinates): string {
    const providerUrl = this.configService.get<string>('AIR_QUALITY_API_URL');
    const APIKey = this.configService.get<string>('API_KEY');
    const APIKeyToken = this.configService.get<string>('API_KEY_TOKEN');
    const longitudeToken = this.configService.get<string>('LONGITUDE_TOKEN');
    const latitudeToken = this.configService.get<string>('LATITUDE_TOKEN');

    return providerUrl
      .replace(APIKeyToken, APIKey)
      .replace(longitudeToken, coordinates.longitude.toString())
      .replace(latitudeToken, coordinates.latitude.toString());
  }
}
