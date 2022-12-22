import { CreateBlogsDto } from './dto/create-blogs.dto';
import { ForbiddenException, HttpException, Injectable } from '@nestjs/common';
import { QueryArrType } from '../types/types';
import { ConvertFiltersForDB } from '../infrastructure/common/convertFiltersForDB';
import { PaginationDto } from '../infrastructure/common/dto/pagination.dto';
import { Pagination } from '../infrastructure/common/pagination';
import * as uuid4 from 'uuid4';
import { BlogsEntity } from './entities/blogs.entity';
import { BlogsRepository } from './blogs.repository';
import { PaginationWithItems } from '../infrastructure/common/types/paginationWithItems';
import { CaslAbilityFactory } from '../ability/casl-ability.factory';
import { ForbiddenError } from '@casl/ability';
import { Action } from '../auth/roles/action.enum';

@Injectable()
export class BlogsService {
  constructor(
    protected convertFiltersForDB: ConvertFiltersForDB,
    protected pagination: Pagination,
    protected blogsRepository: BlogsRepository,
    protected caslAbilityFactory: CaslAbilityFactory,
  ) {}
  async createBlog(createBlogDto: CreateBlogsDto): Promise<BlogsEntity> {
    const blogEntity: BlogsEntity = {
      id: uuid4().toString(),
      name: createBlogDto.name,
      description: createBlogDto.description,
      websiteUrl: createBlogDto.websiteUrl,
      createdAt: new Date().toISOString(),
    };
    const newBlog: BlogsEntity = await this.blogsRepository.createBlog(
      blogEntity,
    );
    return {
      id: newBlog.id,
      name: newBlog.name,
      description: newBlog.description,
      websiteUrl: newBlog.websiteUrl,
      createdAt: newBlog.createdAt,
    };
  }

  async findAll(
    queryPagination: PaginationDto,
    searchFilters: QueryArrType,
  ): Promise<PaginationWithItems> {
    let field = 'createdAt';
    if (
      queryPagination.sortBy === 'name' ||
      queryPagination.sortBy === 'websiteUrl' ||
      queryPagination.sortBy === 'description'
    ) {
      field = queryPagination.sortBy;
    }

    const convertedFilters = await this.convertFiltersForDB.convert(
      searchFilters,
    );
    const pagination = await this.pagination.convert(queryPagination, field);
    const totalCount = await this.blogsRepository.countDocuments(
      convertedFilters,
    );
    const pagesCount = Math.ceil(totalCount / queryPagination.pageSize);
    const blogs: BlogsEntity[] = await this.blogsRepository.findBlogs(
      pagination,
      convertedFilters,
    );
    const pageNumber = queryPagination.pageNumber;
    const pageSize = pagination.pageSize;
    return {
      pagesCount: pagesCount,
      page: pageNumber,
      pageSize: pageSize,
      totalCount: totalCount,
      items: blogs,
    };
  }

  async findOne(id: string): Promise<BlogsEntity | null> {
    return this.blogsRepository.findBlogById(id);
  }

  async updateBlog(id: string, updateBlogDto: CreateBlogsDto) {
    const blogToUpdate: BlogsEntity | null =
      await this.blogsRepository.findBlogById(id);
    if (!blogToUpdate)
      throw new HttpException({ message: ['Not found user'] }, 404);
    const ability = this.caslAbilityFactory.createForBlog({ id: id });
    try {
      ForbiddenError.from(ability).throwUnlessCan(Action.UPDATE, {
        id: blogToUpdate.id,
      });
      const blogEntity = {
        id: blogToUpdate.id,
        name: updateBlogDto.name,
        description: updateBlogDto.description,
        websiteUrl: updateBlogDto.websiteUrl,
        createdAt: blogToUpdate.createdAt,
      };
      return await this.blogsRepository.updatedBlogById(blogEntity);
    } catch (error) {
      if (error instanceof ForbiddenError) {
        throw new ForbiddenException(error.message);
      }
    }
  }

  async removeBlog(id: string) {
    const blogToUpdate = await this.blogsRepository.findBlogById(id);
    if (!blogToUpdate)
      throw new HttpException({ message: ['Not found user'] }, 404);
    const ability = this.caslAbilityFactory.createForBlog({ id: id });
    try {
      ForbiddenError.from(ability).throwUnlessCan(Action.UPDATE, {
        id: blogToUpdate.id,
      });
      return await this.blogsRepository.removeBlog(id);
    } catch (error) {
      if (error instanceof ForbiddenError) {
        throw new ForbiddenException(error.message);
      }
    }
  }
}
