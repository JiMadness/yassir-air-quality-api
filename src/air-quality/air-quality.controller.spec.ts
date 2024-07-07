import { Test, TestingModule } from '@nestjs/testing';
import { AirQualityController } from './air-quality.controller';
import { AirQualityService } from './air-quality/air-quality.service';
import { AirQuality } from './air-quality/types/air-quality.type';
import { GetAirQualityDto } from './dto/get-air-quality.dto';

describe('AirQualityController', () => {
  let controller: AirQualityController;
  let service: AirQualityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AirQualityController],
      providers: [
        {
          provide: AirQualityService,
          useValue: {
            getAirQualityForCoordinates: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AirQualityController>(AirQualityController);
    service = module.get<AirQualityService>(AirQualityService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAirQuality', () => {
    it('should return air quality data for given coordinates', async () => {
      const mockCoordinates: GetAirQualityDto = {
        latitude: 40.7128,
        longitude: -74.006,
      };
      const mockAirQuality: AirQuality = {
        Result: {
          Pollution: {
            ts: '2024-07-07T22:00:00.000Z',
            aqius: 50,
            mainus: 'p2',
            aqicn: 30,
            maincn: 'p1',
          },
        },
      };
      jest
        .spyOn(service, 'getAirQualityForCoordinates')
        .mockResolvedValue(mockAirQuality);

      const result = await controller.getAirQuality(mockCoordinates);

      expect(result).toEqual(mockAirQuality);
      expect(service.getAirQualityForCoordinates).toHaveBeenCalledWith(
        mockCoordinates,
      );
    });

    it('should throw an error if service fails', async () => {
      const mockCoordinates: GetAirQualityDto = {
        latitude: 40.7128,
        longitude: -74.006,
      };
      jest
        .spyOn(service, 'getAirQualityForCoordinates')
        .mockRejectedValue(new Error('Service failed'));

      await expect(controller.getAirQuality(mockCoordinates)).rejects.toThrow(
        'Service failed',
      );
    });
  });
});
