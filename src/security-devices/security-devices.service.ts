import { Injectable } from '@nestjs/common';
import { JWTPayloadDto } from '../auth/dto/payload.dto';
import { SessionDevicesEntity } from './entities/security-device.entity';
import { SecurityDevicesRepository } from './infrastructure/security-devices.repository';

@Injectable()
export class SecurityDevicesService {
  constructor(private securityDevicesRepository: SecurityDevicesRepository) {}
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
    return await this.securityDevicesRepository.createOrUpdateDevices(
      filter,
      newDevices,
    );
  }

  async deleteDeviceByDeviceIdAfterLogout(
    payloadRefreshToken: JWTPayloadDto,
  ): Promise<boolean> {
    return this.securityDevicesRepository.deleteDeviceByDeviceIdAfterLogout(
      payloadRefreshToken,
    );
  }

  async findDevices(currentPayload: JWTPayloadDto) {
    return await this.securityDevicesRepository.findDevices(currentPayload);
  }
  async removeDevicesExceptCurrent(currentPayload: JWTPayloadDto) {
    return await this.securityDevicesRepository.removeDevicesExceptCurrent(
      currentPayload,
    );
  }
  async removeDeviceByDeviceId(currentPayload: JWTPayloadDto) {
    return await this.securityDevicesRepository.removeDeviceByDeviceId(
      currentPayload,
    );
  }
}
