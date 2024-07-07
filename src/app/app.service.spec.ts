import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';

describe('AppService', () => {
  let appService: AppService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [AppService],
    }).compile();

    appService = app.get<AppService>(AppService);
  });

  it('should be defined', () => {
    expect(appService).toBeDefined();
  });

  describe('getUptime', () => {
    let originalProcessUptime: typeof process.uptime;
    const randomUptime = Math.random() * 100;

    beforeEach(() => {
      originalProcessUptime = process.uptime;
      process.uptime = jest.fn().mockReturnValue(randomUptime);
    });

    afterEach(() => {
      process.uptime = originalProcessUptime;
    });

    it('should return the mocked uptime', () => {
      const uptime = appService.getUptime();
      expect(uptime).toBe(randomUptime);
    });
  });
});
