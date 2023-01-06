import { Controller, Delete, HttpCode } from '@nestjs/common';
import { TestingService } from './testing.service';
import { statusCode } from '../logger/status-code.enum';

@Controller('testing')
export class TestingController {
  constructor(private readonly testingService: TestingService) {}

  @Delete('all-data')
  @HttpCode(statusCode.NO_CONTENT)
  async removeAllCollections() {
    return this.testingService.removeAllCollections();
  }
}
