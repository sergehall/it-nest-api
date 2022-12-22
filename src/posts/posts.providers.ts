import { Mongoose } from 'mongoose';
import { PostDocument, PostsSchema } from './schemas/posts.schema';
import { BlogSchema, BlogsDocument } from '../blogs/schemas/blogs.schema';

export const postsProviders = [
  {
    provide: 'POST_MODEL',
    useFactory: (mongoose: Mongoose) =>
      mongoose.model<PostDocument>('Posts', PostsSchema, 'Posts'),
    inject: ['ASYNC_CONNECTION'],
  },
  {
    provide: 'BLOG_MODEL',
    useFactory: (mongoose: Mongoose) =>
      mongoose.model<BlogsDocument>('Blogs', BlogSchema, 'Blogs'),
    inject: ['ASYNC_CONNECTION'],
  },
];
