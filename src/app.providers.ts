import { ProvidersEnums } from './infrastructure/database/enums/providers.enums';
import { Mongoose } from 'mongoose';
import {
  Last10secDocument,
  Last10secSchema,
} from './auth/infrastructure/schemas/last10sec.schemas';
import { NamesCollectionsEnums } from './infrastructure/database/enums/names-collections.enums';
import { ConnectionEnums } from './infrastructure/database/enums/connection.enums';

export const appProviders = [
  {
    provide: ProvidersEnums.LAST_10SEC_MODEL,
    useFactory: (mongoose: Mongoose) =>
      mongoose.model<Last10secDocument>(
        'Last10sec',
        Last10secSchema,
        NamesCollectionsEnums.LAST_10SEC,
      ),
    inject: [ConnectionEnums.ASYNC_CONNECTION],
  },
];
