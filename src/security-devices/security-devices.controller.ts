import { Controller, Get, Param, Delete } from '@nestjs/common';
import { SecurityDevicesService } from './security-devices.service';

@Controller('security-devices')
export class SecurityDevicesController {
  constructor(
    private readonly securityDevicesService: SecurityDevicesService,
  ) {}

  @Get()
  findAll() {
    return this.securityDevicesService.findAll();
  }
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.securityDevicesService.remove(+id);
  }
}
