import { Mongoose } from 'mongoose';
import { PostsDocument, PostsSchema } from './schemas/posts.schema';
import { BlogsDocument, BlogSchema } from '../blogs/schemas/blogs.schema';
import { ProvidersEnums } from '../infrastructure/database/enums/providers.enums';
import { ConnectionEnums } from '../infrastructure/database/enums/connection.enums';
import { NamesCollectionsEnums } from '../infrastructure/database/enums/names-collections.enums';

export const postsProviders = [
  {
    provide: ProvidersEnums.POST_MODEL,
    useFactory: (mongoose: Mongoose) =>
      mongoose.model<PostsDocument>(
        'Posts',
        PostsSchema,
        NamesCollectionsEnums.POSTS,
      ),
    inject: [ConnectionEnums.ASYNC_CONNECTION],
  },
  {
    provide: ProvidersEnums.BLOG_MODEL,
    useFactory: (mongoose: Mongoose) =>
      mongoose.model<BlogsDocument>(
        'Blogs',
        BlogSchema,
        NamesCollectionsEnums.BLOGS,
      ),
    inject: [ConnectionEnums.ASYNC_CONNECTION],
  },
];
