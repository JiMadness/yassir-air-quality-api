import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { AirQualityProviderService } from './air-quality-provider.service';
import { Coordinates } from '../types/coordinates.type';
import { AirQualityAPIResponse } from './types/air-quality-api-response.type';
import { EnvironmentVariables } from '../../types/environment-variables.type';

describe('AirQualityProviderService', () => {
  let service: AirQualityProviderService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AirQualityProviderService,
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: keyof EnvironmentVariables) => {
              const mockEnv = {
                AIR_QUALITY_API_URL:
                  'https://api.example.com/airquality?lat={latitude}&lon={longitude}&apikey={apikey}',
                API_KEY: 'test-api-key',
                API_KEY_TOKEN: '{apikey}',
                LONGITUDE_TOKEN: '{longitude}',
                LATITUDE_TOKEN: '{latitude}',
              };
              return mockEnv[key];
            }),
          },
        },
      ],
    }).compile();

    service = module.get<AirQualityProviderService>(AirQualityProviderService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAirQuality', () => {
    it('should return air quality data', async () => {
      const mockCoordinates: Coordinates = {
        latitude: 40.7128,
        longitude: -74.006,
      };
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const mockResponse: AirQualityAPIResponse = { data: 'sample data' };
      jest
        .spyOn(httpService, 'get')
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        .mockReturnValueOnce(of({ data: mockResponse }));

      const result = await service.getAirQuality(mockCoordinates);

      expect(result).toEqual(mockResponse);
      expect(httpService.get).toHaveBeenCalledWith(
        'https://api.example.com/airquality?lat=40.7128&lon=-74.006&apikey=test-api-key',
      );
    });

    it('should throw an error if http request fails', async () => {
      const mockCoordinates: Coordinates = {
        latitude: 40.7128,
        longitude: -74.006,
      };
      jest
        .spyOn(httpService, 'get')
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        .mockReturnValueOnce(of(Promise.reject(new Error('Request failed'))));

      await expect(service.getAirQuality(mockCoordinates)).rejects.toThrow(
        'Request failed',
      );
    });
  });

  describe('getCompleteProviderURL', () => {
    it('should return the complete provider URL with coordinates', () => {
      const mockCoordinates: Coordinates = {
        latitude: 40.7128,
        longitude: -74.006,
      };

      const result = service['getCompleteProviderURL'](mockCoordinates);

      expect(result).toBe(
        'https://api.example.com/airquality?lat=40.7128&lon=-74.006&apikey=test-api-key',
      );
    });
  });
});
