import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { LikeStatusPostEntity } from '../entities/like-status-post.entity';
import { LikeStatusPostsDocument } from './schemas/like-status-posts.schemas';
import { ProvidersEnums } from '../../infrastructure/database/enums/providers.enums';

@Injectable()
export class LikeStatusPostsRepository {
  constructor(
    @Inject(ProvidersEnums.LIKE_STATUS_POSTS)
    private likeStatusPostModel: Model<LikeStatusPostsDocument>,
  ) {}
  async updateLikeStatusPost(
    dtoLikeStatusPost: LikeStatusPostEntity,
  ): Promise<boolean> {
    const result = await this.likeStatusPostModel
      .findOneAndUpdate(
        {
          $and: [
            { postId: dtoLikeStatusPost.postId },
            { userId: dtoLikeStatusPost.userId },
          ],
        },
        {
          postId: dtoLikeStatusPost.postId,
          userId: dtoLikeStatusPost.userId,
          login: dtoLikeStatusPost.login,
          likeStatus: dtoLikeStatusPost.likeStatus,
          addedAt: dtoLikeStatusPost.addedAt,
        },
        { upsert: true, returnDocument: 'after' },
      )
      .lean();

    return result !== null;
  }
}
