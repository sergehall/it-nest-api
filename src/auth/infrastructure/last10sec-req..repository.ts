import { Inject, Injectable } from '@nestjs/common';
import { ProvidersEnums } from '../../infrastructure/database/enums/providers.enums';
import { Model } from 'mongoose';
import { Last10secDocument } from './schemas/last10sec.schemas';

@Injectable()
export class Last10secReqRepository {
  constructor(
    @Inject(ProvidersEnums.LAST_10SEC_MODEL)
    private last10secModel: Model<Last10secDocument>,
  ) {}
  async addAndCountByIpAndTimeLog(
    ip: string | null,
    originalUrl: string,
    title: string,
  ): Promise<number> {
    await this.last10secModel.create({
      ip: ip,
      originalUrl: originalUrl,
      title: title,
      createdAt: new Date().toISOString(),
    });
    const currentTimeMinus10sec = new Date(
      Date.now() - 1000 * 10,
    ).toISOString();
    return await this.last10secModel.countDocuments({
      $and: [
        { ip: { $eq: ip } },
        { originalUrl: { $eq: originalUrl } },
        { createdAt: { $gte: currentTimeMinus10sec } },
      ],
    });
  }
  async cleanup() {
    return this.last10secModel.deleteMany({
      createdAt: { $lt: new Date(Date.now() - 1000 * 10).toISOString() },
    });
  }
}
