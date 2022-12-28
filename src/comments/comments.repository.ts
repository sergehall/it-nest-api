import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { ProvidersEnums } from '../infrastructure/database/enums/providers.enums';
import { Comment, CommentsDocument } from './schemas/comments.schema';
import { CommentsEntity } from './entities/comment.entity';
import { UsersEntity } from '../users/entities/users.entity';
import { StatusLike } from '../infrastructure/database/enums/like-status.enums';
import { LikeStatusCommentDocument } from './schemas/like-status-comments.schema';
import { LikeStatusCommentEntity } from './entities/like-status-comment.entity';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentsRepository {
  constructor(
    @Inject(ProvidersEnums.COMMENT_MODEL)
    private commentsModel: Model<CommentsDocument>,
    @Inject(ProvidersEnums.LIKE_STATUS)
    private likeStatusModel: Model<LikeStatusCommentDocument>,
  ) {}
  async createComment(
    postId: string,
    commentEntity: CommentsEntity,
  ): Promise<CommentsEntity> {
    try {
      await this.commentsModel.findOneAndUpdate(
        { postId: postId },
        {
          $push: { comments: commentEntity },
        },
        { upsert: true },
      );
      return commentEntity;
    } catch (error) {
      console.log(error);
      throw new ForbiddenException(error.message);
    }
  }
  async findCommentById(commentId: string): Promise<Comment | null> {
    const result = await this.commentsModel
      .findOne(
        { 'comments.id': commentId },
        {
          _id: false,
          'comments._id': false,
        },
      )
      .then((c) => c?.comments.filter((i) => i.id === commentId)[0]);
    return result ? result : null;
  }
  async findCommentsByPostId(postId: string): Promise<CommentsDocument | null> {
    return await this.commentsModel.findOne(
      { postId: postId },
      { _id: false, 'comments._id': false },
    );
  }
  async preparationCommentsForReturn(
    commentsArray: Comment[],
    currentUser: UsersEntity | null,
  ) {
    const filledComments = [];
    for (const i in commentsArray) {
      const commentId = commentsArray[i].id;
      const currentComment: Comment = commentsArray[i];

      let ownLikeStatus = StatusLike.NONE;
      if (currentUser) {
        const currentComment = await this.likeStatusModel.findOne(
          {
            $and: [{ userId: currentUser.id }, { commentId: commentId }],
          },
          {
            _id: false,
            __v: false,
          },
        );
        if (currentComment) {
          ownLikeStatus = currentComment.likeStatus;
        }
      }

      // getting likes count
      const likesCount = await this.likeStatusModel.countDocuments({
        $and: [{ commentId: commentId }, { likeStatus: 'Like' }],
      });

      // getting dislikes count
      const dislikesCount = await this.likeStatusModel.countDocuments({
        $and: [{ commentId: commentId }, { likeStatus: 'Dislike' }],
      });

      const filledComment = {
        id: currentComment.id,
        content: currentComment.content,
        userId: currentComment.userId,
        userLogin: currentComment.userLogin,
        createdAt: currentComment.createdAt,
        likesInfo: {
          likesCount: likesCount,
          dislikesCount: dislikesCount,
          myStatus: ownLikeStatus,
        },
      };
      filledComments.push(filledComment);
    }
    return filledComments;
  }
  async updateComment(
    commentId: string,
    updateCommentDto: UpdateCommentDto,
  ): Promise<boolean> {
    const result = await this.commentsModel.updateOne(
      { 'comments.id': commentId },
      { $set: { 'comments.$.content': updateCommentDto.content } },
    );

    return result.modifiedCount !== 0 && result.matchedCount !== 0;
  }
  async updateLikeStatusComment(likeStatusCommEntity: LikeStatusCommentEntity) {
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
  async removeComment(commentId: string): Promise<boolean> {
    const resultDeleted = await this.commentsModel.findOneAndUpdate(
      { 'comments.id': commentId },
      {
        $pull: {
          comments: {
            id: commentId,
          },
        },
      },
      { returnDocument: 'after' },
    );
    if (!resultDeleted) {
      return false;
    }
    // check comment is deleted
    return (
      resultDeleted.comments.filter((i) => i.id === commentId).length === 0
    );
  }
}
