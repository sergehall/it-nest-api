import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { PostsEntity } from './entities/posts.entity';
import { Model } from 'mongoose';
import { PostDocument } from './schemas/posts.schema';
import { PaginationDBType, QueryArrType } from '../types/types';

@Injectable()
export class PostsRepository {
  constructor(
    @Inject('POST_MODEL')
    private postsModel: Model<PostDocument>,
  ) {}
  async findPosts(
    pagination: PaginationDBType,
    searchFilters: QueryArrType,
  ): Promise<PostsEntity[]> {
    return await this.postsModel
      .find(
        { $and: searchFilters },
        {
          _id: false,
          __v: false,
          'extendedLikesInfo._id': false,
          'extendedLikesInfo.newestLikes._id': false,
        },
      )
      .limit(pagination.pageSize)
      .skip(pagination.startIndex)
      .sort({ [pagination.field]: pagination.direction })
      .lean();
  }
  async createPost(postsEntity: PostsEntity): Promise<PostsEntity> {
    try {
      return await this.postsModel.create(postsEntity);
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }
  async countDocuments(searchFilters: QueryArrType): Promise<number> {
    return await this.postsModel.countDocuments({
      $or: searchFilters,
    });
  }
}
