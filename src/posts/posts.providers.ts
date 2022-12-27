import { Mongoose } from 'mongoose';
import { PostsDocument, PostsSchema } from './schemas/posts.schema';
import { BlogsDocument, BlogSchema } from '../blogs/schemas/blogs.schema';
import { ProvidersEnums } from '../infrastructure/database/enums/providers.enums';
import { ConnectionEnums } from '../infrastructure/database/enums/connection.enums';
import { NamesCollectionsEnums } from '../infrastructure/database/enums/names-collections.enums';
import {
  CommentsDocument,
  CommentsSchema,
} from '../comments/schemas/comments.schema';
import {
  LikeStatusCommentDocument,
  LikeStatusCommentSchema,
} from '../comments/schemas/like-status-comments.schema';

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
  {
    provide: ProvidersEnums.COMMENT_MODEL,
    useFactory: (mongoose: Mongoose) =>
      mongoose.model<CommentsDocument>(
        'Comments',
        CommentsSchema,
        NamesCollectionsEnums.COMMENTS,
      ),
    inject: [ConnectionEnums.ASYNC_CONNECTION],
  },
  {
    provide: ProvidersEnums.LIKE_STATUS,
    useFactory: (mongoose: Mongoose) =>
      mongoose.model<LikeStatusCommentDocument>(
        NamesCollectionsEnums.LIKE_STATUS,
        LikeStatusCommentSchema,
        NamesCollectionsEnums.LIKE_STATUS,
      ),
    inject: [ConnectionEnums.ASYNC_CONNECTION],
  },
];
