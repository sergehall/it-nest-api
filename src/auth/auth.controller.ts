import { Controller, Get, Post, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req: any) {
    console.log('login---');
    return req.user;
  }
  // @UseGuards(LocalAuthGuard)
  // @Post('login')
  // async login(@Request() req: any, @Response({ passthrough: true }) res: any) {
  //   const userData = req.user;
  //   console.log(userData);
  //   res.cookie('refreshToken', userData.refreshToken, {
  //     httpOnly: true,
  //     secure: true,
  //   });
  //   return { accessToken: req.user.data.accessToken };
  // }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req: any) {
    return req.user;
  }
}
