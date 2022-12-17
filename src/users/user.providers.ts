import { Mongoose } from 'mongoose';
import { UserSchema } from './schemas/user.schema';

export const userProviders = [
  {
    provide: 'USER_MODEL',
    useFactory: (mongoose: Mongoose) => mongoose.model('Users', UserSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
