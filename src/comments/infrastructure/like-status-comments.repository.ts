import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { ProvidersEnums } from '../../infrastructure/database/enums/providers.enums';
import { LikeStatusCommentEntity } from '../entities/like-status-comment.entity';
import { LikeStatusCommentDocument } from './schemas/like-status-comments.schema';

@Injectable()
export class LikeStatusCommentsRepository {
  constructor(
    @Inject(ProvidersEnums.LIKE_STATUS_COMMENTS)
    private likeStatusModel: Model<LikeStatusCommentDocument>,
  ) {}
  async updateLikeStatusComment(
    likeStatusCommEntity: LikeStatusCommentEntity,
  ): Promise<boolean> {
    const result = await this.likeStatusModel
      .findOneAndUpdate(
        {
          $and: [
            { commentId: likeStatusCommEntity.commentId },
            { userId: likeStatusCommEntity.userId },
          ],
        },
        {
          $set: {
            commentId: likeStatusCommEntity.commentId,
            userId: likeStatusCommEntity.userId,
            likeStatus: likeStatusCommEntity.likeStatus,
            createdAt: likeStatusCommEntity.createdAt,
          },
        },
        { upsert: true, returnDocument: 'after' },
      )
      .lean();

    return result !== null;
  }
}
