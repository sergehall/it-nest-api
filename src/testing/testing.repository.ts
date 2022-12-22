import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { UsersDocument } from '../users/schemas/user.schema';
import { PostsDocument } from '../posts/schemas/posts.schema';
import { BlogsDocument } from '../blogs/schemas/blogs.schema';

@Injectable()
export class TestingRepository {
  constructor(
    @Inject('USER_MODEL')
    private usersModel: Model<UsersDocument>,
    @Inject('BLOG_MODEL')
    private blogsModel: Model<BlogsDocument>,
    @Inject('POST_MODEL')
    private postsModel: Model<PostsDocument>,
  ) {}
  async delAllData(): Promise<boolean> {
    // delete all Collections
    await this.usersModel.deleteMany({});
    await this.blogsModel.deleteMany({});
    await this.postsModel.deleteMany({});
    // await this.myModelEmailsConfirmCode.deleteMany({});
    // await this.myModelEmailsRecoveryCode.deleteMany({});
    // await MyModelBlogs.deleteMany({});
    // await MyModelPosts.deleteMany({});
    // await MyModelDevicesSchema.deleteMany({});
    // await MyModelLikeStatusPostsId.deleteMany({});
    // await MyModelLikeStatusCommentId.deleteMany({});
    // await MyModelBlackListIP.deleteMany({});
    // await MyModeLast10secRegConf.deleteMany({});
    // await MyModeLast10secReg.deleteMany({});
    // await MyModeLast10secLog.deleteMany({});
    // await MyModeLast10secRedEmailRes.deleteMany({});
    // await MyModelComments.deleteMany({});
    // await MyModelBlackListRefreshTokenJWT.deleteMany({});
    return true;
  }
}
