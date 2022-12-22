import { Mongoose } from 'mongoose';
import { UserSchema, UsersDocument } from '../users/schemas/user.schema';
import { BlogSchema, BlogsDocument } from '../blogs/schemas/blogs.schema';
import { PostsSchema, PostsDocument } from '../posts/schemas/posts.schema';

export const testingProviders = [
  {
    provide: 'USER_MODEL',
    useFactory: (mongoose: Mongoose) =>
      mongoose.model<UsersDocument>('Users', UserSchema, 'Users'),
    inject: ['ASYNC_CONNECTION'],
  },
  {
    provide: 'BLOG_MODEL',
    useFactory: (mongoose: Mongoose) =>
      mongoose.model<BlogsDocument>('Blogs', BlogSchema, 'Blogs'),
    inject: ['ASYNC_CONNECTION'],
  },
  {
    provide: 'POST_MODEL',
    useFactory: (mongoose: Mongoose) =>
      mongoose.model<PostsDocument>('Posts', PostsSchema, 'Posts'),
    inject: ['ASYNC_CONNECTION'],
  },
];
