import { Mongoose } from 'mongoose';
import {
  UsersSchema,
  UsersDocument,
} from '../../users/infrastructure/schemas/user.schema';
import {
  BlogSchema,
  BlogsDocument,
} from '../../blogs/infrastructure/schemas/blogs.schema';
import {
  PostsSchema,
  PostsDocument,
} from '../../posts/infrastructure/schemas/posts.schema';
import { ConnectionEnums } from '../../infrastructure/database/enums/connection.enums';
import { NamesCollectionsEnums } from '../../infrastructure/database/enums/names-collections.enums';
import { ProvidersEnums } from '../../infrastructure/database/enums/providers.enums';
import {
  LikeStatusPostSchema,
  LikeStatusPostsDocument,
} from '../../posts/infrastructure/schemas/like-status-posts.schemas';
import {
  LikeStatusCommentDocument,
  LikeStatusCommentSchema,
} from '../../comments/infrastructure/schemas/like-status-comments.schema';
import {
  CommentsDocument,
  CommentsSchema,
} from '../../comments/infrastructure/schemas/comments.schema';
import {
  Last10secDocument,
  Last10secSchema,
} from '../../auth/infrastructure/schemas/last10sec.schemas';
import {
  EmailsConfirmCodeDocument,
  EmailsConfirmCodeSchema,
} from '../../mails/infrastructure/schemas/email-confirm-code.schema';
import {
  BlackListRefreshJWTDocument,
  BlackListRefreshJWTSchema,
} from '../../auth/infrastructure/schemas/jwt-blacklist.schema';
import {
  DevicesDocument,
  DevicesSchema,
} from '../../security-devices/infrastructure/schemas/devices.schema';

export const testingProviders = [
  {
    provide: ProvidersEnums.USER_MODEL,
    useFactory: (mongoose: Mongoose) =>
      mongoose.model<UsersDocument>(
        'Users',
        UsersSchema,
        NamesCollectionsEnums.USERS,
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
    provide: ProvidersEnums.LAST_10SEC_MODEL,
    useFactory: (mongoose: Mongoose) =>
      mongoose.model<Last10secDocument>(
        'Last10sec',
        Last10secSchema,
        NamesCollectionsEnums.LAST_10SEC,
      ),
    inject: [ConnectionEnums.ASYNC_CONNECTION],
  },
  {
    provide: ProvidersEnums.CONFIRM_CODE_MODEL,
    useFactory: (mongoose: Mongoose) =>
      mongoose.model<EmailsConfirmCodeDocument>(
        'EmailsConfirmCodes',
        EmailsConfirmCodeSchema,
        NamesCollectionsEnums.EMAILS_CONFIRM_CODES,
      ),
    inject: [ConnectionEnums.ASYNC_CONNECTION],
  },
  {
    provide: ProvidersEnums.BL_REFRESH_JWT_MODEL,
    useFactory: (mongoose: Mongoose) =>
      mongoose.model<BlackListRefreshJWTDocument>(
        'BlackListRefreshJWT',
        BlackListRefreshJWTSchema,
        NamesCollectionsEnums.BL_REFRESH_JWT,
      ),
    inject: [ConnectionEnums.ASYNC_CONNECTION],
  },
  {
    provide: ProvidersEnums.DEVICES_MODEL,
    useFactory: (mongoose: Mongoose) =>
      mongoose.model<DevicesDocument>(
        'Devices',
        DevicesSchema,
        NamesCollectionsEnums.DEVICES,
      ),
    inject: [ConnectionEnums.ASYNC_CONNECTION],
  },
];
