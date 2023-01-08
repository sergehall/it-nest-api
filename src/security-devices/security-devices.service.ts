import { Injectable } from '@nestjs/common';
import { CreateSecurityDeviceDto } from './dto/create-security-device.dto';
import { UpdateSecurityDeviceDto } from './dto/update-security-device.dto';
import { JWTPayloadDto } from '../auth/dto/payload.dto';
import { SessionDevicesEntity } from './entities/security-device.entity';
import { SecurityDevicesRepository } from './infrastructure/security-devices.repository';

@Injectable()
export class SecurityDevicesService {
  constructor(private SecurityDevicesRepository: SecurityDevicesRepository) {}
  async createDevices(
    newPayload: JWTPayloadDto,
    clientIp: string,
    userAgent: string,
  ): Promise<boolean> {
    const filter = { userId: newPayload.userId, deviceId: newPayload.deviceId };
    const newDevices: SessionDevicesEntity = {
      userId: newPayload.userId,
      ip: clientIp,
      title: userAgent,
      lastActiveDate: new Date(newPayload.iat * 1000).toISOString(),
      expirationDate: new Date(newPayload.exp * 1000).toISOString(),
      deviceId: newPayload.deviceId,
    };
    return await this.SecurityDevicesRepository.createOrUpdateDevices(
      filter,
      newDevices,
    );
  }

  async deleteDeviceByDeviceIdAfterLogout(
    payloadRefreshToken: JWTPayloadDto,
  ): Promise<boolean> {
    return this.SecurityDevicesRepository.deleteDeviceByDeviceIdAfterLogout(
      payloadRefreshToken,
    );
  }

  create(createSecurityDeviceDto: CreateSecurityDeviceDto) {
    return 'This action adds a new securityDevice';
  }

  findAll() {
    return `This action returns all securityDevices`;
  }

  findOne(id: number) {
    return `This action returns a #${id} securityDevice`;
  }

  update(id: number, updateSecurityDeviceDto: UpdateSecurityDeviceDto) {
    return `This action updates a #${id} securityDevice`;
  }

  remove(id: number) {
    return `This action removes a #${id} securityDevice`;
  }
}
