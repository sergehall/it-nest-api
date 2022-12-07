import { Injectable } from '@nestjs/common';

@Injectable()
export class TestingService {
  async removeAllData(): Promise<boolean> {
    // return await this.testingRepository.delAllData();
    return true;
  }
}
