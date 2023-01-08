import { ProvidersEnums } from '../../infrastructure/database/enums/providers.enums';
import { Mongoose } from 'mongoose';
import { NamesCollectionsEnums } from '../../infrastructure/database/enums/names-collections.enums';
import { ConnectionEnums } from '../../infrastructure/database/enums/connection.enums';
import {
  Last10secDocument,
  Last10secSchema,
} from './schemas/last10sec.schemas';
import {
  UsersDocument,
  UsersSchema,
} from '../../users/infrastructure/schemas/user.schema';
import {
  BlackListRefreshJWTDocument,
  BlackListRefreshJWTSchema,
} from './schemas/jwt-blacklist.schema';

export const authProviders = [
  {
    provide: ProvidersEnums.LAST_10SEC,
    useFactory: (mongoose: Mongoose) =>
      mongoose.model<Last10secDocument>(
        'Last10sec',
        Last10secSchema,
        NamesCollectionsEnums.LAST_10SEC,
      ),
    inject: [ConnectionEnums.ASYNC_CONNECTION],
  },
  {
    provide: ProvidersEnums.USER_MODEL,
    useFactory: (mongoose: Mongoose) =>
      mongoose.model<UsersDocument>(
        'Users',
        UsersSchema,
        NamesCollectionsEnums.USERS,
      ),
    inject: [ConnectionEnums.ASYNC_CONNECTION],
  },
  {
    provide: ProvidersEnums.BL_REFRESH_JWT,
    useFactory: (mongoose: Mongoose) =>
      mongoose.model<BlackListRefreshJWTDocument>(
        'BlackListRefreshJWT',
        BlackListRefreshJWTSchema,
        NamesCollectionsEnums.BL_REFRESH_JWT,
      ),
    inject: [ConnectionEnums.ASYNC_CONNECTION],
  },
];
