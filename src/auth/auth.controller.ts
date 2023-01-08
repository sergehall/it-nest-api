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
import { JWTPayloadDto } from './dto/payload.dto';
import { SecurityDevicesService } from '../security-devices/security-devices.service';
import { RefreshJwtValidGuard } from './guards/refresh-jwt-valid.guard';
import { BlacklistJwtRepository } from './infrastructure/blacklist-refresh-jwt.repository';

@Controller('auth')
export class AuthController {
  constructor(
    private AuthService: AuthService,
    private UsersService: UsersService,
    private SecurityDevicesService: SecurityDevicesService,
    private BlacklistJwtRepository: BlacklistJwtRepository,
  ) {}
  @HttpCode(HttpStatus.OK)
  @UseGuards(LimitReqGuard)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Request() req: any,
    @Res({ passthrough: true }) res: Response,
    @Ip() ip: string,
  ) {
    const token = await this.AuthService.signRefreshJWT(req.user);
    const newPayload: JWTPayloadDto = await this.AuthService.decode(
      token.refreshToken,
    );
    let userAgent = req.get('user-agent');
    if (!userAgent) {
      userAgent = 'None';
    }
    await this.SecurityDevicesService.createDevices(newPayload, ip, userAgent);
    // res.cookie('refreshToken', token.refreshToken);
    res.cookie('refreshToken', token.refreshToken, {
      httpOnly: true,
      secure: true,
    });
    return this.AuthService.signAccessJWT(req.user);
  }
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(LimitReqGuard)
  @Post('registration')
  async registration(
    @Request() req: any,
    @Body() loginDto: LoginDto,
    @Ip() ip: string,
  ) {
    const userExist = await this.UsersService.userAlreadyExist(
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
    const newUser = await this.UsersService.createUserRegistration(
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
  @Post('registration-email-resending')
  async registrationEmailResending(@Body() emailDto: EmailDto) {
    return await this.UsersService.updateAndSentConfirmationCodeByEmail(
      emailDto.email,
    );
  }
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(LimitReqGuard)
  @UseGuards(RefreshJwtValidGuard)
  @Post('logout')
  async logout(@Request() req: any) {
    const refreshToken = req.cookies.refreshToken;
    const payload: JWTPayloadDto = await this.AuthService.decode(refreshToken);
    const currentJwt = {
      refreshToken: refreshToken,
      expirationDate: new Date(payload.exp * 1000).toISOString(),
    };
    await this.BlacklistJwtRepository.addJWT(currentJwt);
    await this.SecurityDevicesService.deleteDeviceByDeviceIdAfterLogout(
      payload,
    );
    return true;
  }
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(LimitReqGuard)
  @Post('registration-confirmation')
  async registrationConfirmation(@Body() codeDto: CodeDto) {
    const result = await this.UsersService.confirmByCodeInParams(codeDto.code);
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
