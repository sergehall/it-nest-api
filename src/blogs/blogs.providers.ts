import { Mongoose } from 'mongoose';
import { BlogSchema, BlogsDocument } from './schemas/blogs.schema';

export const blogsProviders = [
  {
    provide: 'BLOG_MODEL',
    useFactory: (mongoose: Mongoose) =>
      mongoose.model<BlogsDocument>('Blogs', BlogSchema, 'Blogs'),
    inject: ['ASYNC_CONNECTION'],
  },
];
