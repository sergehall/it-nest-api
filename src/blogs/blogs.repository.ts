import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { BlogEntity } from './entities/blog.entity';
import { Model } from 'mongoose';
import { UserDocument } from '../users/schemas/user.schema';
import { PaginationDBType, QueryArrType } from '../types/types';

@Injectable()
export class BlogsRepository {
  constructor(
    @Inject('BLOG_MODEL')
    private blogsModel: Model<UserDocument>,
  ) {}

  async createBlog(blogEntity: BlogEntity) {
    try {
      return await this.blogsModel.create(blogEntity);
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }
  async findBlogById(blogId: string): Promise<BlogEntity | null> {
    return await this.blogsModel.findOne(
      { id: blogId },
      {
        _id: false,
        __v: false,
      },
    );
  }
  async removeBlogById(id: string): Promise<boolean> {
    const result = await this.blogsModel.deleteOne({ id: id });
    return result.acknowledged && result.deletedCount === 1;
  }
  async updatedBlogById(blogEntity: BlogEntity): Promise<boolean> {
    return await this.blogsModel
      .findOneAndUpdate(
        { id: blogEntity.id },
        {
          $set: {
            id: blogEntity.id,
            name: blogEntity.name,
            description: blogEntity.description,
            websiteUrl: blogEntity.websiteUrl,
            createdAt: blogEntity.createdAt,
          },
        },
        { returnDocument: 'after', projection: { _id: false, __v: false } },
      )
      .lean();
  }
  async countDocuments(searchFilters: QueryArrType) {
    return await this.blogsModel.countDocuments({
      $or: searchFilters,
    });
  }
  async findBlogs(
    pagination: PaginationDBType,
    searchFilters: QueryArrType,
  ): Promise<BlogEntity[]> {
    return await this.blogsModel
      .find(
        {
          $or: searchFilters,
        },
        {
          _id: false,
          __v: false,
        },
      )
      .limit(pagination.pageSize)
      .skip(pagination.startIndex)
      .sort({ [pagination.field]: pagination.direction })
      .lean();
  }
}
