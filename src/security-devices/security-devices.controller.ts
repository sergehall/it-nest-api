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
import { JWTPayloadDto } from '../auth/dto/payload.dto';
import { AuthService } from '../auth/auth.service';

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
    const currentPayload: JWTPayloadDto = await this.authService.decode(
      refreshToken,
    );
    return this.securityDevicesService.findDevices(currentPayload);
  }
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtCookiesValidGuard)
  @Delete('devices')
  async removeDevicesExceptCurrent(@Request() req: any) {
    const refreshToken = req.cookies.refreshToken;
    const currentPayload: JWTPayloadDto = await this.authService.decode(
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
    if (!deviceId) {
      throw new HttpException(
        { message: ['Not found device'] },
        HttpStatus.NOT_FOUND,
      );
    }
    const refreshToken = req.cookies.refreshToken;
    const currentPayload: JWTPayloadDto = await this.authService.decode(
      refreshToken,
    );
    const result = await this.securityDevicesService.removeDeviceByDeviceId(
      currentPayload,
    );
    if (result === '204') {
      return true;
    }
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
  }
}
