import { ProvidersEnums } from '../../infrastructure/database/enums/providers.enums';
import { Mongoose } from 'mongoose';
import { NamesCollectionsEnums } from '../../infrastructure/database/enums/names-collections.enums';
import { ConnectionEnums } from '../../infrastructure/database/enums/connection.enums';
import { DevicesDocument, DevicesSchema } from './schemas/devices.schema';

export const devicesProviders = [
  {
    provide: ProvidersEnums.DEVICES_MODEL,
    useFactory: (mongoose: Mongoose) =>
      mongoose.model<DevicesDocument>(
        'Devices',
        DevicesSchema,
        NamesCollectionsEnums.DEVICES,
      ),
    inject: [ConnectionEnums.ASYNC_CONNECTION],
  },
];
