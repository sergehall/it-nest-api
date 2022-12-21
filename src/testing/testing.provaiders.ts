import { Mongoose } from 'mongoose';
import { UserDocument, UserSchema } from '../users/schemas/user.schema';
import { BlogSchema, BlogsDocument } from '../blogs/schemas/blogs.schema';

export const testingProviders = [
  {
    provide: 'USER_MODEL',
    useFactory: (mongoose: Mongoose) =>
      mongoose.model<UserDocument>('Users', UserSchema, 'Users'),
    inject: ['ASYNC_CONNECTION'],
  },
  {
    provide: 'BLOG_MODEL',
    useFactory: (mongoose: Mongoose) =>
      mongoose.model<BlogsDocument>('Blogs', BlogSchema, 'Blogs'),
    inject: ['ASYNC_CONNECTION'],
  },
];
