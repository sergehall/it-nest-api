import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../auth.service';
import { UsersEntity } from '../../users/entities/users.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'loginOrEmail',
    });
  }

  async validate(
    loginOrEmail: string,
    password: string,
  ): Promise<UsersEntity | null> {
    console.log(loginOrEmail, 'loginOrEmail');
    console.log(password, 'password');
    const messages = [];
    if (
      loginOrEmail.toString().length < 3 ||
      loginOrEmail.toString().length > 20
    ) {
      messages.push({
        message: 'Unsuitable loginOrEmail min 3 max 20',
        field: 'loginOrEmail',
      });
    }
    if (password.toString().length < 6 || password.toString().length > 20) {
      messages.push({
        message: 'Unsuitable password min 6 max 20',
        field: 'password',
      });
    }
    if (messages.length !== 0) {
      throw new HttpException(
        {
          message: messages,
        },
        400,
      );
    }

    const user = await this.authService.validatePassword(
      loginOrEmail,
      password,
    );
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
