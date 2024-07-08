import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/mongoose';
import { AirQualityForParis } from '../schemas/air-quality-for-paris.schema';
import { Model } from 'mongoose';
import { Coordinates } from '../types/coordinates.type';
import { AirQualityProviderService } from '../air-quality-provider/air-quality-provider.service';

@Injectable()
export class ParisAirQualityJobService {
  private readonly logger = new Logger(ParisAirQualityJobService.name);
  private readonly coordinatesForParis: Coordinates = {
    latitude: 48.856613,
    longitude: 2.352222,
  };

  constructor(
    @InjectModel(AirQualityForParis.name)
    private readonly airQualityForParisModel: Model<AirQualityForParis>,
    private readonly airQualityProviderService: AirQualityProviderService,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async putAirQualityForParis() {
    this.logger.log('Paris air quality job started');
    const airQualityProviderResponse =
      await this.airQualityProviderService.getAirQuality(
        this.coordinatesForParis,
      );

    const newAirQualityForParis: AirQualityForParis = {
      ts: airQualityProviderResponse.data.current.pollution.ts,
      aqius: airQualityProviderResponse.data.current.pollution.aqius,
      mainus: airQualityProviderResponse.data.current.pollution.mainus,
      aqicn: airQualityProviderResponse.data.current.pollution.aqicn,
      maincn: airQualityProviderResponse.data.current.pollution.maincn,
      aqiavr: this.calculatePollutionAverage(
        airQualityProviderResponse.data.current.pollution.aqius,
        airQualityProviderResponse.data.current.pollution.aqicn,
      ),
    };

    this.logger.log(`New air quality for Paris:\n${JSON.stringify(newAirQualityForParis)}`);

    await this.airQualityForParisModel.create(newAirQualityForParis);
    this.logger.log('Paris air quality job finished successfully');
  }

  private calculatePollutionAverage(aqius: number, aqicn: number): number {
    return (aqicn + aqius) / 2;
  }
}
