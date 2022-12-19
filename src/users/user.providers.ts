import { Mongoose } from 'mongoose';
import { UserDocument, UserSchema } from './schemas/user.schema';

export const userProviders = [
  {
    provide: 'USER_MODEL',
    useFactory: (mongoose: Mongoose) =>
      mongoose.model<UserDocument>('Users', UserSchema, 'Users'),
    inject: ['ASYNC_CONNECTION'],
  },
];
