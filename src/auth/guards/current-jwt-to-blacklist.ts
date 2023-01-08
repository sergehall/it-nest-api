import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { BlacklistRefreshJwtRepository } from '../infrastructure/blacklist-refresh-jwt.repository';
import jwt_decode from 'jwt-decode';
import { JWTPayloadDto } from '../dto/payload.dto';
import { JwtBlacklistDto } from '../dto/jwt-blacklist.dto';

@Injectable()
export class CurrentJwtToBlacklist implements CanActivate {
  constructor(private blacklistJWT: BlacklistRefreshJwtRepository) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.cookies?.['refreshToken'];
    if (token) {
      const payload: JWTPayloadDto = jwt_decode(token);
      if (payload) {
        const jwtBlacklistDto: JwtBlacklistDto = {
          refreshToken: token,
          expirationDate: new Date(payload.exp * 1000).toISOString(),
        };
        await this.blacklistJWT.addJWT(jwtBlacklistDto);
      }
      return true;
    }
    return true;
  }
}