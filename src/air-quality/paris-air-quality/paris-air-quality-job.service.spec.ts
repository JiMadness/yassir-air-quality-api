import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { ParisAirQualityJobService } from './paris-air-quality-job.service';
import { AirQualityProviderService } from '../air-quality-provider/air-quality-provider.service';
import { Model } from 'mongoose';
import { AirQualityForParis } from '../schemas/air-quality-for-paris.schema';

describe('ParisAirQualityJobService', () => {
  let service: ParisAirQualityJobService;
  let airQualityProviderService: AirQualityProviderService;
  let airQualityForParisModel: Model<AirQualityForParis>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ParisAirQualityJobService,
        {
          provide: AirQualityProviderService,
          useValue: {
            getAirQuality: jest.fn(),
          },
        },
        {
          provide: getModelToken(AirQualityForParis.name),
          useValue: Model, // Mocked value, actual instance is not needed for tests
        },
      ],
    }).compile();

    service = module.get<ParisAirQualityJobService>(ParisAirQualityJobService);
    airQualityProviderService = module.get<AirQualityProviderService>(
      AirQualityProviderService,
    );
    airQualityForParisModel = module.get<Model<AirQualityForParis>>(
      getModelToken(AirQualityForParis.name),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should put air quality for Paris', async () => {
    const mockAirQualityResponse = {
      data: {
        current: {
          pollution: {
            ts: '2024-07-08T01:00:00.000Z',
            aqius: 50,
            mainus: 'p2',
            aqicn: 30,
            maincn: 'p1',
          },
        },
      },
    };

    const createSpy = jest
      .spyOn(airQualityForParisModel, 'create')
      .mockResolvedValueOnce(null);
    const getAirQualitySpy = jest
      .spyOn(airQualityProviderService, 'getAirQuality')
      .mockResolvedValue(mockAirQualityResponse);

    await service.putAirQualityForParis();

    expect(getAirQualitySpy).toHaveBeenCalledWith(
      service['coordinatesForParis'],
    );
    expect(createSpy).toHaveBeenCalledWith({
      ts: mockAirQualityResponse.data.current.pollution.ts,
      aqius: mockAirQualityResponse.data.current.pollution.aqius,
      mainus: mockAirQualityResponse.data.current.pollution.mainus,
      aqicn: mockAirQualityResponse.data.current.pollution.aqicn,
      maincn: mockAirQualityResponse.data.current.pollution.maincn,
      aqiavr: service['calculatePollutionAverage'](
        mockAirQualityResponse.data.current.pollution.aqius,
        mockAirQualityResponse.data.current.pollution.aqicn,
      ),
    });
  });

  it('should calculate pollution average', () => {
    const average = service['calculatePollutionAverage'](50, 30);
    expect(average).toBe(40);
  });
});
