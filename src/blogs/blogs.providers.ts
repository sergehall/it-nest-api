import { Mongoose } from 'mongoose';
import { BlogSchema, BlogsDocument } from './schemas/blogs.schema';
import { PostsDocument, PostsSchema } from '../posts/schemas/posts.schema';

export const blogsProviders = [
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
