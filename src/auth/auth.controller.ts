import {
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  HttpCode,
} from '@nestjs/common';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @HttpCode(200)
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

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Request() req: any) {
    return req.user;
  }
}
