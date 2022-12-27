import { HttpException, Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { PaginationDto } from '../infrastructure/common/pagination/dto/pagination.dto';
import { Pagination } from '../infrastructure/common/pagination/pagination';
import { UsersEntity } from '../users/entities/users.entity';
import * as uuid4 from 'uuid4';
import { StatusLike } from '../infrastructure/database/enums/like-status.enums';
import { CommentsRepository } from './comments.repository';
import { CommentsEntity } from './entities/comment.entity';
import { LikeStatusDto } from './dto/like-status.dto';
import { LikeStatusCommentEntity } from './entities/like-status-comment.entity';
import { User } from '../users/schemas/user.schema';

@Injectable()
export class CommentsService {
  constructor(
    protected pagination: Pagination,
    protected commentsRepository: CommentsRepository,
  ) {}
  async createComment(
    postId: string,
    createCommentDto: CreateCommentDto,
    user: UsersEntity,
  ): Promise<CommentsEntity> {
    const newComment: CommentsEntity = {
      id: uuid4().toString(),
      content: createCommentDto.content,
      userId: user.id,
      userLogin: user.login,
      createdAt: new Date().toISOString(),
      likesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: StatusLike.NONE,
      },
    };

    return await this.commentsRepository.createComment(postId, newComment);
  }
  async getCommentById(commentId: string, currentUser: UsersEntity | null) {
    const comment = await this.commentsRepository.findCommentById(commentId);
    if (!comment)
      throw new HttpException({ message: ['Not found comment'] }, 404);
    const filledComments =
      await this.commentsRepository.preparationCommentsForReturn(
        [comment],
        currentUser,
      );
    return filledComments[0];
  }

  async findCommentsByPostId(
    queryPagination: PaginationDto,
    postId: string,
    currentUser: UsersEntity | null,
  ) {
    const commentsDoc = await this.commentsRepository.findCommentsByPostId(
      postId,
    );
    if (!commentsDoc || commentsDoc.comments.length === 0) {
      return {
        pagesCount: 1,
        page: 1,
        pageSize: 10,
        totalCount: 0,
        items: [],
      };
    }
    let desc = 1;
    let asc = -1;
    let field: 'userId' | 'userLogin' | 'content' | 'createdAt' = 'createdAt';
    if (
      queryPagination.sortDirection === 'asc' ||
      queryPagination.sortDirection === 'ascending' ||
      queryPagination.sortDirection === 1
    ) {
      desc = -1;
      asc = 1;
    }
    if (
      queryPagination.sortBy === 'content' ||
      queryPagination.sortBy === 'userLogin'
    ) {
      field = queryPagination.sortBy;
    }
    const totalCount = commentsDoc.comments.length;
    const allComments = commentsDoc.comments.sort(
      await byField(field, asc, desc),
    );

    async function byField(
      field: 'userId' | 'userLogin' | 'content' | 'createdAt',
      asc: number,
      desc: number,
    ) {
      return (a: CommentsEntity, b: CommentsEntity) =>
        a[field] > b[field] ? asc : desc;
    }
    const startIndex =
      (queryPagination.pageNumber - 1) * queryPagination.pageSize;
    const pagesCount = Math.ceil(totalCount / queryPagination.pageSize);

    const commentsSlice = allComments.slice(
      startIndex,
      startIndex + queryPagination.pageSize,
    );
    const filledComments =
      await this.commentsRepository.preparationCommentsForReturn(
        commentsSlice,
        currentUser,
      );

    return {
      pagesCount: pagesCount,
      page: queryPagination.pageNumber,
      pageSize: queryPagination.pageSize,
      totalCount: totalCount,
      items: filledComments,
    };
  }
  async changeLikeStatusComment(
    commentId: string,
    likeStatusDto: LikeStatusDto,
    currentUser: User,
  ): Promise<boolean> {
    const findCommentInDB = await this.commentsRepository.findCommentById(
      commentId,
    );
    if (!findCommentInDB) {
      throw new HttpException({ message: ['Not found comment'] }, 404);
    }
    const likeStatusCommEntity: LikeStatusCommentEntity = {
      commentId: commentId,
      userId: currentUser.id,
      likeStatus: likeStatusDto.likeStatus,
      createdAt: new Date().toISOString(),
    };
    return await this.commentsRepository.updateLikeStatusComment(
      likeStatusCommEntity,
    );
  }
  async findOne(id: string) {
    return `This action returns a #${id} comment`;
  }

  async update(id: string, updateCommentDto: UpdateCommentDto) {
    return `This action updates a #${id} comment`;
  }

  async remove(id: string) {
    return `This action removes a #${id} comment`;
  }
}
