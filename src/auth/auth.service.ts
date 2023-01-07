import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersEntity } from '../users/entities/users.entity';
import * as uuid4 from 'uuid4';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}
  async validatePassword(
    loginOrEmail: string,
    password: string,
  ): Promise<UsersEntity | null> {
    const user = await this.usersService.findUserByLoginOrEmail(loginOrEmail);
    if (user && (await bcrypt.compare(password, user.passwordHash))) {
      return user;
    }
    return null;
  }

  async signAccessJWT(user: UsersEntity) {
    const deviceId = uuid4().toString();
    const payload = { id: user.id, login: user.login, deviceId: deviceId };
    return {
      accessToken: this.jwtService.sign(payload, {
        secret: process.env.ACCESS_SECRET_KEY,
        expiresIn: process.env.EXP_ACC_TIME,
      }),
    };
  }

  async signRefreshJWT(user: UsersEntity) {
    const deviceId = uuid4().toString();
    const payload = {
      id: user.id,
      login: user.login,
      deviceId: deviceId,
    };
    return {
      refreshToken: this.jwtService.sign(payload, {
        secret: process.env.REFRESH_SECRET_KEY,
        expiresIn: process.env.EXP_REF_TIME,
      }),
    };
  }
  async validAccessJWT(JWT: string): Promise<UsersEntity | null> {
    try {
      const result = await this.jwtService.verify(JWT, {
        secret: process.env.ACCESS_SECRET_KEY,
      });
      return result;
    } catch (err) {
      return null;
    }
  }
}
