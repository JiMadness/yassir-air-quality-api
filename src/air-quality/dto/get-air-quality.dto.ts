import { IsLatitude, IsLongitude, IsNotEmpty } from 'class-validator';

export class GetAirQualityDto {
  @IsLongitude()
  @IsNotEmpty()
  longitude: number;

  @IsLatitude()
  @IsNotEmpty()
  latitude: number;
}
