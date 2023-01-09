import { Inject, Injectable } from '@nestjs/common';
import { ProvidersEnums } from '../../infrastructure/database/enums/providers.enums';
import { Model } from 'mongoose';

import { JwtBlacklistDto } from '../dto/jwt-blacklist.dto';
import { JwtRefreshBlacklistDocument } from './schemas/jwtRefresh-blacklist.schema';

@Injectable()
export class BlacklistJwtRepository {
  constructor(
    @Inject(ProvidersEnums.BL_REFRESH_JWT_MODEL)
    private JwtRefreshBlacklistModel: Model<JwtRefreshBlacklistDocument>,
  ) {}
  async findJWT(refreshToken: string): Promise<boolean> {
    const result = await this.JwtRefreshBlacklistModel.findOne({
      refreshToken: { $eq: refreshToken },
    });
    return result !== null;
  }
  async addJWT(jwtBlacklistDto: JwtBlacklistDto): Promise<boolean> {
    try {
      const result = await this.JwtRefreshBlacklistModel.create(
        {
          refreshToken: jwtBlacklistDto.refreshToken,
          expirationDate: jwtBlacklistDto.expirationDate,
        },
        { upsert: true, returnDocument: 'after' },
      );
      return result !== null;
    } catch (err) {
      return false;
    }
  }
  async clearingInvalidJWTFromBlackList() {
    return await this.JwtRefreshBlacklistModel.deleteMany({
      expirationDate: { $lt: new Date().toISOString() },
    });
  }
}
