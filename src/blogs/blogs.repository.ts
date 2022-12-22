import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { BlogsEntity } from './entities/blogs.entity';
import { Model } from 'mongoose';
import { BlogsDocument } from './schemas/blogs.schema';
import { QueryArrType } from '../infrastructure/common/convert-filters/types/convert-filter.types';
import { PaginationDBType } from '../infrastructure/common/pagination/types/pagination.types';

@Injectable()
export class BlogsRepository {
  constructor(
    @Inject('BLOG_MODEL')
    private blogsModel: Model<BlogsDocument>,
  ) {}

  async createBlog(blogEntity: BlogsEntity): Promise<BlogsEntity> {
    try {
      return await this.blogsModel.create(blogEntity);
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }
  async findBlogById(blogId: string): Promise<BlogsEntity | null> {
    return await this.blogsModel.findOne(
      { id: blogId },
      {
        _id: false,
        __v: false,
      },
    );
  }
  async removeBlog(id: string): Promise<boolean> {
    const result = await this.blogsModel.deleteOne({ id: id });
    return result.acknowledged && result.deletedCount === 1;
  }
  async updatedBlogById(blogEntity: BlogsEntity): Promise<boolean> {
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
  async countDocuments(searchFilters: QueryArrType): Promise<number> {
    return await this.blogsModel.countDocuments({
      $or: searchFilters,
    });
  }
  async findBlogs(
    pagination: PaginationDBType,
    searchFilters: QueryArrType,
  ): Promise<BlogsEntity[]> {
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
