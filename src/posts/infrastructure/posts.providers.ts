import { Mongoose } from 'mongoose';
import { PostsDocument, PostsSchema } from './schemas/posts.schema';
import {
  BlogsDocument,
  BlogSchema,
} from '../../blogs/infrastructure/schemas/blogs.schema';
import { ProvidersEnums } from '../../infrastructure/database/enums/providers.enums';
import { ConnectionEnums } from '../../infrastructure/database/enums/connection.enums';
import { NamesCollectionsEnums } from '../../infrastructure/database/enums/names-collections.enums';
import {
  CommentsDocument,
  CommentsSchema,
} from '../../comments/infrastructure/schemas/comments.schema';
import {
  LikeStatusCommentDocument,
  LikeStatusCommentSchema,
} from '../../comments/infrastructure/schemas/like-status-comments.schema';
import {
  LikeStatusPostSchema,
  LikeStatusPostsDocument,
} from './schemas/like-status-posts.schemas';
import {
  UsersDocument,
  UsersSchema,
} from '../../users/infrastructure/schemas/user.schema';
import {
  EmailsConfirmCodeDocument,
  EmailsConfirmCodeSchema,
} from '../../mails/infrastructure/schemas/email-confirm-code.schema';
import {
  refreshTokenBlackListDocument,
  RefreshTokenBlacklistSchema,
} from '../../auth/infrastructure/schemas/refreshToken-blacklist.schema';

export const postsProviders = [
  {
    provide: ProvidersEnums.BL_REFRESH_JWT_MODEL,
    useFactory: (mongoose: Mongoose) =>
      mongoose.model<refreshTokenBlackListDocument>(
        NamesCollectionsEnums.REFRESH_TOKEN_BL,
        RefreshTokenBlacklistSchema,
        NamesCollectionsEnums.REFRESH_TOKEN_BL,
      ),
    inject: [ConnectionEnums.ASYNC_CONNECTION],
  },
  {
    provide: ProvidersEnums.POST_MODEL,
    useFactory: (mongoose: Mongoose) =>
      mongoose.model<PostsDocument>(
        NamesCollectionsEnums.POSTS,
        PostsSchema,
        NamesCollectionsEnums.POSTS,
      ),
    inject: [ConnectionEnums.ASYNC_CONNECTION],
  },
  {
    provide: ProvidersEnums.BLOG_MODEL,
    useFactory: (mongoose: Mongoose) =>
      mongoose.model<BlogsDocument>(
        NamesCollectionsEnums.BLOGS,
        BlogSchema,
        NamesCollectionsEnums.BLOGS,
      ),
    inject: [ConnectionEnums.ASYNC_CONNECTION],
  },
  {
    provide: ProvidersEnums.COMMENT_MODEL,
    useFactory: (mongoose: Mongoose) =>
      mongoose.model<CommentsDocument>(
        NamesCollectionsEnums.COMMENTS,
        CommentsSchema,
        NamesCollectionsEnums.COMMENTS,
      ),
    inject: [ConnectionEnums.ASYNC_CONNECTION],
  },
  {
    provide: ProvidersEnums.LIKE_STATUS_COMMENTS_MODEL,
    useFactory: (mongoose: Mongoose) =>
      mongoose.model<LikeStatusCommentDocument>(
        NamesCollectionsEnums.LIKE_STATUS_COMMENTS,
        LikeStatusCommentSchema,
        NamesCollectionsEnums.LIKE_STATUS_COMMENTS,
      ),
    inject: [ConnectionEnums.ASYNC_CONNECTION],
  },
  {
    provide: ProvidersEnums.LIKE_STATUS_POSTS_MODEL,
    useFactory: (mongoose: Mongoose) =>
      mongoose.model<LikeStatusPostsDocument>(
        NamesCollectionsEnums.LIKE_STATUS_POST,
        LikeStatusPostSchema,
        NamesCollectionsEnums.LIKE_STATUS_POST,
      ),
    inject: [ConnectionEnums.ASYNC_CONNECTION],
  },
  {
    provide: ProvidersEnums.USER_MODEL,
    useFactory: (mongoose: Mongoose) =>
      mongoose.model<UsersDocument>(
        NamesCollectionsEnums.USERS,
        UsersSchema,
        NamesCollectionsEnums.USERS,
      ),
    inject: [ConnectionEnums.ASYNC_CONNECTION],
  },
  {
    provide: ProvidersEnums.CONFIRM_CODE_MODEL,
    useFactory: (mongoose: Mongoose) =>
      mongoose.model<EmailsConfirmCodeDocument>(
        NamesCollectionsEnums.EMAILS_CONFIRM_CODES,
        EmailsConfirmCodeSchema,
        NamesCollectionsEnums.EMAILS_CONFIRM_CODES,
      ),
    inject: [ConnectionEnums.ASYNC_CONNECTION],
  },
];
