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
  async countIpLast10Sec(
    ip: string | null,
    originalUrl: string,
  ): Promise<number> {
    return await this.last10secModel.countDocuments({
      $and: [
        { ip: { $eq: ip } },
        { originalUrl: { $eq: originalUrl } },
        { createdAt: { $gte: Date.now() - 1000 * 10 } },
      ],
    });
  }
  async addIpLast10Sec(
    ip: string | null,
    originalUrl: string,
    title: string,
  ): Promise<boolean> {
    const add = await this.last10secModel.create({
      ip: ip,
      originalUrl: originalUrl,
      title: title,
      createdAt: Date.now(),
    });
    return add.id;
  }
  async cleanup() {
    return this.last10secModel.deleteMany({
      createdAt: { $lt: new Date(Date.now() - 1000 * 10) },
    });
  }
}
