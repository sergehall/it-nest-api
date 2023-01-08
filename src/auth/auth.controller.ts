import {
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  HttpCode,
  Body,
  HttpException,
  Ip,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { LimitReqGuard } from './guards/last10sec-req.guards';
import { LoginDto } from './dto/login.dto';
import { UsersService } from '../users/users.service';
import { EmailDto } from './dto/email.dto';
import { CodeDto } from './dto/code.dto';
import { Response } from 'express';
import { CurrentJwtToBlacklist } from './guards/current-jwt-to-blacklist';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}
  @HttpCode(HttpStatus.OK)
  @UseGuards(LimitReqGuard)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req: any, @Res({ passthrough: true }) res: Response) {
    const token = await this.authService.signRefreshJWT(req.user);
    // res.cookie('refreshToken', token.refreshToken);
    res.cookie('refreshToken', token.refreshToken, {
      httpOnly: true,
      secure: true,
    });
    return this.authService.signAccessJWT(req.user);
  }
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(LimitReqGuard)
  @Post('registration')
  async registration(
    @Request() req: any,
    @Body() loginDto: LoginDto,
    @Ip() ip: string,
  ) {
    const userExist = await this.usersService.userAlreadyExist(
      loginDto.login,
      loginDto.email,
    );
    if (userExist) {
      throw new HttpException(
        {
          message: [
            {
              message: `${userExist} already exists`,
              field: userExist,
            },
          ],
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    let userAgent = req.get('user-agent');
    if (!userAgent) {
      userAgent = 'None';
    }
    const registrationData = {
      ip: ip,
      userAgent: userAgent,
    };
    const newUser = await this.usersService.createUserRegistration(
      loginDto,
      registrationData,
    );
    return {
      id: newUser.id,
      login: newUser.login,
      email: newUser.email,
    };
  }
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(LimitReqGuard)
  @UseGuards(CurrentJwtToBlacklist)
  @Post('registration-email-resending')
  async registrationEmailResending(@Body() emailDto: EmailDto) {
    return await this.usersService.updateAndSentConfirmationCodeByEmail(
      emailDto.email,
    );
  }
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(LimitReqGuard)
  @Post('registration-confirmation')
  async registrationConfirmation(@Body() codeDto: CodeDto) {
    const result = await this.usersService.confirmByCodeInParams(codeDto.code);
    if (!result) {
      throw new HttpException(
        {
          message: [
            {
              message:
                'Confirmation code is incorrect, expired or already been applied',
              field: 'code',
            },
          ],
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    return true;
  }
  @UseGuards(LimitReqGuard)
  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Request() req: any) {
    return req.user;
  }
}
