import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { UsersService } from '../../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.ACCESS_SECRET_KEY,
      signOptions: { expiresIn: process.env.EXP_ACC_TIME },
    });
  }

  async validate(payload: any) {
    const user = await this.usersService.findUserByUserId(payload.userId);
    if (user) {
      return {
        email: user.email,
        login: user.login,
        userId: user.id,
      };
    }
    return false;
  }
}
