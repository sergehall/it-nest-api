import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { UsersDocument } from '../../users/infrastructure/schemas/user.schema';
import { PostsDocument } from '../../posts/infrastructure/schemas/posts.schema';
import { BlogsDocument } from '../../blogs/infrastructure/schemas/blogs.schema';
import { ProvidersEnums } from '../../infrastructure/database/enums/providers.enums';
import { LikeStatusPostsDocument } from '../../posts/infrastructure/schemas/like-status-posts.schemas';
import { LikeStatusCommentDocument } from '../../comments/infrastructure/schemas/like-status-comments.schema';
import { CommentsDocument } from '../../comments/infrastructure/schemas/comments.schema';
import { Last10secDocument } from '../../auth/infrastructure/schemas/last10sec.schemas';

@Injectable()
export class TestingRepository {
  constructor(
    @Inject(ProvidersEnums.USER_MODEL)
    private usersModel: Model<UsersDocument>,
    @Inject(ProvidersEnums.BLOG_MODEL)
    private blogsModel: Model<BlogsDocument>,
    @Inject(ProvidersEnums.POST_MODEL)
    private postsModel: Model<PostsDocument>,
    @Inject(ProvidersEnums.LIKE_STATUS_POSTS)
    private likeStatusPostModel: Model<LikeStatusPostsDocument>,
    @Inject(ProvidersEnums.LIKE_STATUS_COMMENTS)
    private likeStatusCommentModel: Model<LikeStatusCommentDocument>,
    @Inject(ProvidersEnums.COMMENT_MODEL)
    private commentsModel: Model<CommentsDocument>,
    @Inject(ProvidersEnums.LAST_10SEC)
    private last10secModel: Model<Last10secDocument>,
  ) {}
  async delAllData(): Promise<boolean> {
    // delete all Collections
    await this.usersModel.deleteMany({});
    await this.blogsModel.deleteMany({});
    await this.postsModel.deleteMany({});
    await this.commentsModel.deleteMany({});
    await this.likeStatusPostModel.deleteMany({});
    await this.likeStatusCommentModel.deleteMany({});
    await this.last10secModel.deleteMany({});
    // await this.myModelEmailsConfirmCode.deleteMany({});
    // await this.myModelEmailsRecoveryCode.deleteMany({});
    // await MyModelDevicesSchema.deleteMany({});
    // await MyModelBlackListIP.deleteMany({});
    // await MyModelBlackListRefreshTokenJWT.deleteMany({});
    return true;
  }
}
