import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import jwt_decode from 'jwt-decode';
import { JWTPayloadDto } from '../dto/payload.dto';
import { JwtBlacklistDto } from '../dto/jwt-blacklist.dto';
import { BlacklistJwtRepository } from '../infrastructure/blacklist-refresh-jwt.repository';

@Injectable()
export class RefreshTokenToBlacklist implements CanActivate {
  constructor(private blacklistJwtRepository: BlacklistJwtRepository) {}
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
        await this.blacklistJwtRepository.addJWT(jwtBlacklistDto);
      }
    }
    return true;
  }
}
