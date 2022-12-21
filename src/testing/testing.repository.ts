import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { UserDocument } from '../users/schemas/user.schema';

@Injectable()
export class TestingRepository {
  constructor(
    @Inject('USER_MODEL')
    private usersModel: Model<UserDocument>,
    @Inject('BLOG_MODEL')
    private blogsModel: Model<UserDocument>,
  ) {}
  async delAllData(): Promise<boolean> {
    // delete all Collections
    await this.usersModel.deleteMany({});
    await this.blogsModel.deleteMany({});
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
