import { Injectable } from '@nestjs/common';
import * as process from 'node:process';

@Injectable()
export class AppService {
  getUptime(): number {
    return process.uptime();
  }
}
