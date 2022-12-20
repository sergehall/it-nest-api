import { Injectable } from '@nestjs/common';
import { TestingRepository } from './testing.repository';

@Injectable()
export class TestingService {
  constructor(protected testingRepository: TestingRepository) {}
  async removeAllData(): Promise<boolean> {
    return await this.testingRepository.delAllData();
  }
}
