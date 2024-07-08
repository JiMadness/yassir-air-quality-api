import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AirQualityForParis } from '../schemas/air-quality-for-paris.schema';
import { Model } from 'mongoose';

@Injectable()
export class ParisAirQualityService {
  constructor(
    @InjectModel(AirQualityForParis.name)
    private readonly airQualityForParisModel: Model<AirQualityForParis>,
  ) {}

  async getDateTimeWhenMostPolluted(): Promise<{ ts: string }> {
    const entry = (
      await this.airQualityForParisModel
        .find()
        .sort({ aqiavr: -1 })
        .limit(1)
        .exec()
    ).pop();

    return { ts: entry?.ts };
  }
}
