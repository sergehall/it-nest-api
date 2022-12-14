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
import { LoginDto } from './dto/login.dto';
import { UsersService } from '../users/users.service';
import { EmailDto } from './dto/email.dto';
import { CodeDto } from './dto/code.dto';
import { Response } from 'express';
import { SecurityDevicesService } from '../security-devices/security-devices.service';
import { JwtCookiesValidGuard } from './guards/jwt-cookies-valid.guard';
import { PayloadDto } from './dto/payload.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    private securityDevicesService: SecurityDevicesService,
  ) {}
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Request() req: any,
    @Res({ passthrough: true }) res: Response,
    @Ip() ip: string,
  ) {
    const token = await this.authService.signRefreshJWT(req.user);
    const newPayload: PayloadDto = await this.authService.decode(
      token.refreshToken,
    );
    let userAgent = req.get('user-agent');
    if (!userAgent) {
      userAgent = 'None';
    }
    await this.securityDevicesService.createDevices(newPayload, ip, userAgent);
    // res.cookie('refreshToken', token.refreshToken);
    res.cookie('refreshToken', token.refreshToken, {
      httpOnly: true,
      secure: true,
    });
    return this.authService.signAccessJWT(req.user);
  }
  @HttpCode(HttpStatus.NO_CONTENT)
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
  @Post('registration-email-resending')
  async registrationEmailResending(@Body() emailDto: EmailDto) {
    return await this.usersService.updateAndSentConfirmationCodeByEmail(
      emailDto.email,
    );
  }
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtCookiesValidGuard)
  @Post('refresh-token')
  async refreshToken(
    @Request() req: any,
    @Res({ passthrough: true }) res: Response,
    @Ip() ip: string,
  ) {
    const refreshToken = req.cookies.refreshToken;
    const currentPayload: PayloadDto = await this.authService.decode(
      refreshToken,
    );
    const jwtBlackList = {
      refreshToken: refreshToken,
      expirationDate: new Date(currentPayload.exp * 1000).toISOString(),
    };
    await this.authService.addRefreshTokenToBl(jwtBlackList);
    const newRefreshToken = await this.authService.updateRefreshJWT(
      currentPayload,
    );
    const newPayload: PayloadDto = await this.authService.decode(
      newRefreshToken.refreshToken,
    );
    const userAgent = req.get('user-agent');
    await this.securityDevicesService.createDevices(newPayload, ip, userAgent);
    // res.cookie('refreshToken', newRefreshToken.refreshToken);
    res.cookie('refreshToken', newRefreshToken.refreshToken, {
      httpOnly: true,
      secure: true,
    });
    return await this.authService.updateAccessJWT(currentPayload);
  }
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtCookiesValidGuard)
  @Post('logout')
  async logout(@Request() req: any) {
    const refreshToken = req.cookies.refreshToken;
    const payload: PayloadDto = await this.authService.decode(refreshToken);
    const currentJwt = {
      refreshToken: refreshToken,
      expirationDate: new Date(payload.exp * 1000).toISOString(),
    };
    await this.authService.addRefreshTokenToBl(currentJwt);
    await this.securityDevicesService.deleteDeviceByDeviceIdAfterLogout(
      payload,
    );
    return true;
  }
  @HttpCode(HttpStatus.NO_CONTENT)
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
  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Request() req: any) {
    return req.user;
  }
}
