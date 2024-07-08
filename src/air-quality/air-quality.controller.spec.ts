import { Test, TestingModule } from '@nestjs/testing';
import { AirQualityController } from './air-quality.controller';
import { AirQualityService } from './air-quality/air-quality.service';
import { ParisAirQualityService } from './paris-air-quality/paris-air-quality.service';
import { GetAirQualityDto } from './dto/get-air-quality.dto';
import { AirQuality } from './air-quality/types/air-quality.type';

describe('AirQualityController', () => {
  let controller: AirQualityController;
  let airQualityService: AirQualityService;
  let parisAirQualityService: ParisAirQualityService;

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
        {
          provide: ParisAirQualityService,
          useValue: {
            getDateTimeWhenMostPolluted: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AirQualityController>(AirQualityController);
    airQualityService = module.get<AirQualityService>(AirQualityService);
    parisAirQualityService = module.get<ParisAirQualityService>(
      ParisAirQualityService,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAirQuality', () => {
    it('should return air quality for the given coordinates', async () => {
      const mockAirQuality: AirQuality = {
        Result: {
          Pollution: {
            ts: '2023-07-08T00:00:00Z',
            aqius: 50,
            mainus: 'p2',
            aqicn: 30,
            maincn: 'p1',
          },
        },
      };
      const coordinates: GetAirQualityDto = {
        latitude: 48.8566,
        longitude: 2.3522,
      };
      jest
        .spyOn(airQualityService, 'getAirQualityForCoordinates')
        .mockResolvedValue(mockAirQuality);

      const result = await controller.getAirQuality(coordinates);

      expect(
        airQualityService.getAirQualityForCoordinates,
      ).toHaveBeenCalledWith(coordinates);
      expect(result).toEqual(mockAirQuality);
    });
  });

  describe('getDateTimeWhenParisMostPolluted', () => {
    it('should return the timestamp when Paris was most polluted', async () => {
      const mockTimestamp = { ts: '2023-07-08T12:00:00Z' };
      jest
        .spyOn(parisAirQualityService, 'getDateTimeWhenMostPolluted')
        .mockResolvedValue(mockTimestamp);

      const result = await controller.getDateTimeWhenParisMostPolluted();

      expect(
        parisAirQualityService.getDateTimeWhenMostPolluted,
      ).toHaveBeenCalled();
      expect(result).toEqual(mockTimestamp);
    });
  });
});
