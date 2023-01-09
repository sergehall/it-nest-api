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
  async findDevices(payload: JWTPayloadDto): Promise<SessionDevicesEntity[]> {
    try {
      return await this.MyModelDevicesSchema.find(
        {
          userId: payload.userId,
          expirationDate: { $gt: new Date().toISOString() },
        },
        {
          _id: false,
          __v: false,
          userId: false,
          expirationDate: false,
        },
      );
    } catch (e) {
      console.log(e);
      return [];
    }
  }
  async removeDevicesExceptCurrent(payload: JWTPayloadDto): Promise<boolean> {
    try {
      return await this.MyModelDevicesSchema.deleteMany({
        $and: [
          { userId: payload.userId },
          { deviceId: { $ne: payload.deviceId } },
        ],
      }).lean();
    } catch (e) {
      console.log(e);
      return false;
    }
  }
  async removeDeviceByDeviceId(payload: JWTPayloadDto): Promise<string> {
    try {
      const findByDeviceId = await this.MyModelDevicesSchema.findOne({
        deviceId: payload.deviceId,
      });
      console.log(findByDeviceId?.userId, payload.userId);
      if (!findByDeviceId) {
        return '404';
      } else if (findByDeviceId && findByDeviceId.userId !== payload.userId) {
        return '403';
      }
      await this.MyModelDevicesSchema.deleteOne({ deviceId: payload.deviceId });
      return '204';
    } catch (e: any) {
      return e.toString();
    }
  }
}