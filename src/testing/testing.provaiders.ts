import { Mongoose } from 'mongoose';
import { UserDocument, UserSchema } from '../users/schemas/user.schema';

export const testingProviders = [
  {
    provide: 'USER_MODEL',
    useFactory: (mongoose: Mongoose) =>
      mongoose.model<UserDocument>('Users', UserSchema, 'Users'),
    inject: ['ASYNC_CONNECTION'],
  },
];
