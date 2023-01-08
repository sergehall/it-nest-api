import { Inject, Injectable } from '@nestjs/common';
import { ProvidersEnums } from '../../infrastructure/database/enums/providers.enums';
import { Model } from 'mongoose';
import {
  BlackListRefreshJWT,
  BlackListRefreshJWTDocument,
} from './schemas/jwt-blacklist.schema';
import { JwtBlacklistDto } from '../dto/jwt-blacklist.dto';

@Injectable()
export class BlacklistRefreshJwtRepository {
  constructor(
    @Inject(ProvidersEnums.BL_REFRESH_JWT)
    private BlackListRefreshModel: Model<BlackListRefreshJWTDocument>,
  ) {}
  async findJWT(refreshToken: string): Promise<BlackListRefreshJWT | null> {
    return await this.BlackListRefreshModel.findOne({
      refreshToken: { $eq: refreshToken },
    });
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
      return true;
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
