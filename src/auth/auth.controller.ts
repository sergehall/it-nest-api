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
} from '@nestjs/common';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { LimitReqGuard } from './guards/last10sec-req.guards';
import { LoginDto } from './dto/login.dto';
import { UsersService } from '../users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}
  @HttpCode(200)
  @UseGuards(LimitReqGuard)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req: any) {
    return this.authService.login(req.user);
  }
  // @UseGuards(LocalAuthGuard)
  // @Post('login')
  // async login(@Request() req: any, @Res({ passthrough: true }) res: any) {
  //   const userData = req.user;
  //   console.log(userData);
  //   res.cookie('refreshToken', userData.refreshToken, {
  //     httpOnly: true,
  //     secure: true,
  //   });
  //   return { accessToken: req.user.data.accessToken };
  // }
  @HttpCode(204)
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
        { message: ['Email or login already exists'] },
        400,
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
  @UseGuards(LimitReqGuard)
  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Request() req: any) {
    return req.user;
  }
}
