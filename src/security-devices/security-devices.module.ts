import { Module } from '@nestjs/common';
import { SecurityDevicesService } from './security-devices.service';
import { SecurityDevicesController } from './security-devices.controller';
import { SecurityDevicesRepository } from './infrastructure/security-devices.repository';
import { devicesProviders } from './infrastructure/devices.providers';
import { DatabaseModule } from '../infrastructure/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [SecurityDevicesController],
  providers: [
    SecurityDevicesRepository,
    SecurityDevicesService,
    ...devicesProviders,
  ],
})
export class SecurityDevicesModule {}
