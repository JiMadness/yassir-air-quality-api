import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app/app.module';
import { AirQualityService } from '../src/air-quality/air-quality/air-quality.service';
import { AirQuality } from '../src/air-quality/air-quality/types/air-quality.type';
import { ParisAirQualityService } from '../src/air-quality/paris-air-quality/paris-air-quality.service';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let airQualityService: AirQualityService;
  let parisAirQualityService: ParisAirQualityService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    airQualityService = moduleFixture.get<AirQualityService>(AirQualityService);
    parisAirQualityService = moduleFixture.get<ParisAirQualityService>(
      ParisAirQualityService,
    );
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect(/^(?!0(\.0+)?$)\d+(\.\d+)?$/);
  });

  describe('/air-quality (GET)', () => {
    it('should return air quality data for given coordinates', async () => {
      const mockCoordinates = { latitude: 40.7128, longitude: -74.006 };
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
        .spyOn(airQualityService, 'getAirQualityForCoordinates')
        .mockResolvedValue(mockAirQuality);

      await request(app.getHttpServer())
        .get('/air-quality')
        .query(mockCoordinates)
        .expect(200)
        .expect(mockAirQuality);
    });

    it('should return 400 if query is empty', async () => {
      await request(app.getHttpServer()).get('/air-quality').expect(400);
    });

    it('should return 400 if query is invalid', async () => {
      await request(app.getHttpServer())
        .get('/air-quality')
        .query({ longitude: 'foo', latitude: 'bar' })
        .expect(400);
    });

    it('should return 500 if service fails', async () => {
      const mockCoordinates = { latitude: 40.7128, longitude: -74.006 };
      jest
        .spyOn(airQualityService, 'getAirQualityForCoordinates')
        .mockRejectedValue(new Error('Service failed'));

      return request(app.getHttpServer())
        .get('/air-quality')
        .query(mockCoordinates)
        .expect(500);
    });
  });

  describe('/air-quality/paris/most-polluted/ts (GET)', () => {
    it('should return the timestamp when Paris was most polluted', async () => {
      const mockTimestamp = { ts: '2024-07-08T12:00:00Z' };
      jest
        .spyOn(parisAirQualityService, 'getDateTimeWhenMostPolluted')
        .mockResolvedValue(mockTimestamp);

      await request(app.getHttpServer())
        .get('/air-quality/paris/most-polluted/ts')
        .expect(200)
        .expect(mockTimestamp);
    });

    it('should return 500 if service fails', async () => {
      jest
        .spyOn(parisAirQualityService, 'getDateTimeWhenMostPolluted')
        .mockRejectedValue(new Error('Service failed'));

      await request(app.getHttpServer())
        .get('/air-quality/paris/most-polluted/ts')
        .expect(500);
    });
  });
});
