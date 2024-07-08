import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ParisAirQualityService } from './paris-air-quality.service';
import { AirQualityForParis } from '../schemas/air-quality-for-paris.schema';

describe('ParisAirQualityService', () => {
  let service: ParisAirQualityService;
  let model: Model<AirQualityForParis>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ParisAirQualityService,
        {
          provide: getModelToken(AirQualityForParis.name),
          useValue: {
            find: jest.fn().mockReturnThis(),
            sort: jest.fn().mockReturnThis(),
            limit: jest.fn().mockReturnThis(),
            exec: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ParisAirQualityService>(ParisAirQualityService);
    model = module.get<Model<AirQualityForParis>>(
      getModelToken(AirQualityForParis.name),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return the timestamp of the most polluted entry', async () => {
    const mockEntry = { ts: '2023-07-08T00:00:00Z', aqiavr: 100 };
    model['exec'] = jest.fn().mockResolvedValueOnce([mockEntry]);

    const result = await service.getDateTimeWhenMostPolluted();

    expect(model['find']).toHaveBeenCalled();
    expect(model['sort']).toHaveBeenCalledWith({ aqiavr: -1 });
    expect(model['limit']).toHaveBeenCalledWith(1);
    expect(model['exec']).toHaveBeenCalled();
    expect(result).toEqual({ ts: mockEntry.ts });
  });

  it('should handle no entries gracefully', async () => {
    model['exec'] = jest.fn().mockResolvedValueOnce([]);

    const result = await service.getDateTimeWhenMostPolluted();

    expect(model['find']).toHaveBeenCalled();
    expect(model['sort']).toHaveBeenCalledWith({ aqiavr: -1 });
    expect(model['limit']).toHaveBeenCalledWith(1);
    expect(model['exec']).toHaveBeenCalled();
    expect(result).toEqual({ ts: undefined });
  });
});
