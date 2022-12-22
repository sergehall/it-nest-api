import { Mongoose } from 'mongoose';
import { UserSchema, UsersDocument } from './schemas/user.schema';

export const usersProviders = [
  {
    provide: 'USER_MODEL',
    useFactory: (mongoose: Mongoose) =>
      mongoose.model<UsersDocument>('Users', UserSchema, 'Users'),
    inject: ['ASYNC_CONNECTION'],
  },
];
