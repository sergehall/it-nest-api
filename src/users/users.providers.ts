import { Mongoose } from 'mongoose';
import { UserSchema, UsersDocument } from './schemas/user.schema';
import { ProvidersEnums } from '../infrastructure/database/enums/providers.enums';
import { ConnectionEnums } from '../infrastructure/database/enums/connection.enums';
import { NamesCollectionsEnums } from '../infrastructure/database/enums/names-collections.enums';

export const usersProviders = [
  {
    provide: ProvidersEnums.USER_MODEL,
    useFactory: (mongoose: Mongoose) =>
      mongoose.model<UsersDocument>(
        'Users',
        UserSchema,
        NamesCollectionsEnums.USERS,
      ),
    inject: [ConnectionEnums.ASYNC_CONNECTION],
  },
];
