// import { Injectable } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import mongoose from 'mongoose';
// import {
//   EmailConfirmCodeType,
//   EmailRecoveryCodeType,
//   UserType,
// } from '../../types/types';
//
// @Injectable()
// export class TestingRepository {
//   constructor(
//     @InjectModel('users') private usersModel: mongoose.Model<UserType>,
//     @InjectModel('MyModelEmailsConfirmCode')
//     private myModelEmailsConfirmCode: mongoose.Model<EmailConfirmCodeType>,
//     @InjectModel('MyModelEmailsRecoveryCode')
//     private myModelEmailsRecoveryCode: mongoose.Model<EmailRecoveryCodeType>,
//   ) {}
//   async delAllData(): Promise<boolean> {
//     // delete all Collections
//     await this.usersModel.deleteMany({});
//     await this.myModelEmailsConfirmCode.deleteMany({});
//     await this.myModelEmailsRecoveryCode.deleteMany({});
//     // await MyModelBlogs.deleteMany({});
//     // await MyModelPosts.deleteMany({});
//     // await MyModelDevicesSchema.deleteMany({});
//     // await MyModelLikeStatusPostsId.deleteMany({});
//     // await MyModelLikeStatusCommentId.deleteMany({});
//     // await MyModelBlackListIP.deleteMany({});
//     // await MyModeLast10secRegConf.deleteMany({});
//     // await MyModeLast10secReg.deleteMany({});
//     // await MyModeLast10secLog.deleteMany({});
//     // await MyModeLast10secRedEmailRes.deleteMany({});
//     // await MyModelComments.deleteMany({});
//     // await MyModelBlackListRefreshTokenJWT.deleteMany({});
//     return true;
//   }
// }
