import { Test, TestingModule } from '@nestjs/testing';
import { AirQualityService } from './air-quality.service';
import { AirQualityProviderService } from '../air-quality-provider/air-quality-provider.service';
import { Coordinates } from '../types/coordinates.type';
import { AirQuality } from './types/air-quality.type';
import { AirQualityAPIResponse } from '../air-quality-provider/types/air-quality-api-response.type';

describe('AirQualityService', () => {
  let service: AirQualityService;
  let providerService: AirQualityProviderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AirQualityService,
        {
          provide: AirQualityProviderService,
          useValue: {
            getAirQuality: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AirQualityService>(AirQualityService);
    providerService = module.get<AirQualityProviderService>(
      AirQualityProviderService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAirQualityForCoordinates', () => {
    it('should return air quality data for given coordinates', async () => {
      const mockCoordinates: Coordinates = {
        latitude: 40.7128,
        longitude: -74.006,
      };
      const mockProviderResponse: AirQualityAPIResponse = {
        data: {
          current: {
            pollution: {
              ts: '2024-07-07T22:00:00.000Z',
              aqius: 50,
              mainus: 'p2',
              aqicn: 30,
              maincn: 'p1',
            },
          },
        },
      };
      jest
        .spyOn(providerService, 'getAirQuality')
        .mockResolvedValue(mockProviderResponse);

      const result: AirQuality = await service.getAirQualityForCoordinates(
        mockCoordinates,
      );

      expect(result).toEqual({
        Result: {
          Pollution: mockProviderResponse.data.current.pollution,
        },
      });
      expect(providerService.getAirQuality).toHaveBeenCalledWith(
        mockCoordinates,
      );
    });

    it('should throw an error if provider service fails', async () => {
      const mockCoordinates: Coordinates = {
        latitude: 40.7128,
        longitude: -74.006,
      };
      jest
        .spyOn(providerService, 'getAirQuality')
        .mockRejectedValue(new Error('Provider service failed'));

      await expect(
        service.getAirQualityForCoordinates(mockCoordinates),
      ).rejects.toThrow('Provider service failed');
    });
  });

  describe('getAirQualityFromProviderResponse', () => {
    it('should extract air quality data from provider response', () => {
      const mockProviderResponse: AirQualityAPIResponse = {
        data: {
          current: {
            pollution: {
              ts: '2024-07-07T22:00:00.000Z',
              aqius: 50,
              mainus: 'p2',
              aqicn: 30,
              maincn: 'p1',
            },
          },
        },
      };

      const result: AirQuality = (
        service as any
      ).getAirQualityFromProviderResponse(mockProviderResponse);

      expect(result).toEqual({
        Result: {
          Pollution: mockProviderResponse.data.current.pollution,
        },
      });
    });
  });
});
