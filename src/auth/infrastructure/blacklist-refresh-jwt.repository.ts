import { Inject, Injectable } from '@nestjs/common';
import { ProvidersEnums } from '../../infrastructure/database/enums/providers.enums';
import { Model } from 'mongoose';
import { BlackListRefreshJWTDocument } from './schemas/jwt-blacklist.schema';
import { JwtBlacklistDto } from '../dto/jwt-blacklist.dto';

@Injectable()
export class BlacklistJwtRepository {
  constructor(
    @Inject(ProvidersEnums.BL_REFRESH_JWT_MODEL)
    private BlackListRefreshModel: Model<BlackListRefreshJWTDocument>,
  ) {}
  async findJWT(refreshToken: string): Promise<boolean> {
    const result = await this.BlackListRefreshModel.findOne({
      refreshToken: { $eq: refreshToken },
    });
    return result !== null;
  }
  async addJWT(jwtBlacklistDto: JwtBlacklistDto): Promise<boolean> {
    try {
      const result = await this.BlackListRefreshModel.create(
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
    return await this.BlackListRefreshModel.deleteMany({
      expirationDate: { $lt: new Date().toISOString() },
    });
  }
}
