import { Mongoose } from 'mongoose';
import { BlogSchema, BlogsDocument } from './schemas/blogs.schema';
import {
  PostsDocument,
  PostsSchema,
} from '../../posts/infrastructure/schemas/posts.schema';
import { NamesCollectionsEnums } from '../../infrastructure/database/enums/names-collections.enums';
import { ProvidersEnums } from '../../infrastructure/database/enums/providers.enums';
import { ConnectionEnums } from '../../infrastructure/database/enums/connection.enums';
import {
  LikeStatusPostSchema,
  LikeStatusPostsDocument,
} from '../../posts/infrastructure/schemas/like-status-posts.schemas';

export const blogsProviders = [
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
    provide: ProvidersEnums.LIKE_STATUS_POSTS,
    useFactory: (mongoose: Mongoose) =>
      mongoose.model<LikeStatusPostsDocument>(
        NamesCollectionsEnums.LIKE_STATUS_POST,
        LikeStatusPostSchema,
        NamesCollectionsEnums.LIKE_STATUS_POST,
      ),
    inject: [ConnectionEnums.ASYNC_CONNECTION],
  },
];