import {
  Controller,
  Get,
  Delete,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  HttpException,
  Param,
} from '@nestjs/common';
import { SecurityDevicesService } from './security-devices.service';
import { JwtCookiesValidGuard } from '../auth/guards/jwt-cookies-valid.guard';
import { AuthService } from '../auth/auth.service';
import { PayloadDto } from '../auth/dto/payload.dto';
import { SkipThrottle } from '@nestjs/throttler';

@SkipThrottle()
@Controller('security')
export class SecurityDevicesController {
  constructor(
    private readonly securityDevicesService: SecurityDevicesService,
    private authService: AuthService,
  ) {}
  @UseGuards(JwtCookiesValidGuard)
  @Get('devices')
  async findDevices(@Request() req: any) {
    const refreshToken = req.cookies.refreshToken;
    const currentPayload: PayloadDto = await this.authService.decode(
      refreshToken,
    );
    return this.securityDevicesService.findDevices(currentPayload);
  }
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtCookiesValidGuard)
  @Delete('devices')
  async removeDevicesExceptCurrent(@Request() req: any) {
    const refreshToken = req.cookies.refreshToken;
    const currentPayload: PayloadDto = await this.authService.decode(
      refreshToken,
    );
    return this.securityDevicesService.removeDevicesExceptCurrent(
      currentPayload,
    );
  }
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtCookiesValidGuard)
  @Delete('/devices/:deviceId')
  async removeDeviceByDeviceId(
    @Request() req: any,
    @Param('deviceId') deviceId: string,
  ) {
    const currentPayload: PayloadDto = await this.authService.decode(
      req.cookies.refreshToken,
    );
    const result = await this.securityDevicesService.removeDeviceByDeviceId(
      deviceId,
      currentPayload,
    );
    if (result === '404') {
      throw new HttpException(
        { message: ['Not found device'] },
        HttpStatus.NOT_FOUND,
      );
    }
    if (result === '403') {
      throw new HttpException(
        {
          message: ['FORBIDDEN. You try to delete the deviceId of other user'],
        },
        HttpStatus.FORBIDDEN,
      );
    }
    return true;
  }
}
