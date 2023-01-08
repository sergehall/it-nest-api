import { Inject, Injectable } from '@nestjs/common';
import { FiltersDevicesEntity } from '../entities/filters-devices.entity';
import { SessionDevicesEntity } from '../entities/security-device.entity';
import { Model } from 'mongoose';
import { DevicesDocument } from './schemas/devices.schema';
import { ProvidersEnums } from '../../infrastructure/database/enums/providers.enums';
import { JWTPayloadDto } from '../../auth/dto/payload.dto';

@Injectable()
export class SecurityDevicesRepository {
  constructor(
    @Inject(ProvidersEnums.DEVICES_MODEL)
    private MyModelDevicesSchema: Model<DevicesDocument>,
  ) {}
  async createOrUpdateDevices(
    filter: FiltersDevicesEntity,
    newDevices: SessionDevicesEntity,
  ): Promise<boolean> {
    try {
      return await this.MyModelDevicesSchema.findOneAndUpdate(
        filter,
        {
          $set: newDevices,
        },
        { upsert: true },
      ).lean();
    } catch (e) {
      console.log(e);
      return false;
    }
  }
  async deleteDeviceByDeviceIdAfterLogout(
    payloadRefreshToken: JWTPayloadDto,
  ): Promise<boolean> {
    try {
      const result = await this.MyModelDevicesSchema.deleteOne({
        $and: [
          { userId: payloadRefreshToken.userId },
          { deviceId: payloadRefreshToken.deviceId },
        ],
      });
      return result.deletedCount === 1;
    } catch (e: any) {
      return e.toString();
    }
  }
}
