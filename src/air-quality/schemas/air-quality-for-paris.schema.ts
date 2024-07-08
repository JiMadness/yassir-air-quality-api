import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AirQualityForParisDocument = HydratedDocument<AirQualityForParis>;

@Schema()
export class AirQualityForParis {
  @Prop({ type: String, required: true })
  ts: string;
  @Prop({ type: Number, required: true })
  aqius: number;
  @Prop({ type: String, required: true })
  mainus: string;
  @Prop({ type: Number, required: true })
  aqicn: number;
  @Prop({ type: String, required: true })
  maincn: string;
  @Prop({ type: Number, required: true, index: true })
  aqiavr: number;
}

export const AirQualityForParisSchema =
  SchemaFactory.createForClass(AirQualityForParis);
