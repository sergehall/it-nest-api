import { CreateBlogsDto } from './dto/create-blogs.dto';
import { Injectable } from '@nestjs/common';
import {
  DtoQueryType,
  EntityPaginationType,
  ReturnObjWithPagination,
} from '../types/types';
import { ConvertFiltersForDB } from '../infrastructure/common/convertFiltersForDB';
import { QueryDto } from '../infrastructure/common/manual-parse-queries/dto/query-dto';
import { UpdateBlogDto } from './dto/update-blods.dto';
import { EntityPagination } from '../posts/infrastructure/entityPagination';

@Injectable()
export class BlogsService {
  constructor(
    protected convertFiltersForDB: ConvertFiltersForDB,
    protected entityPagination: EntityPagination,
  ) {}
  async create(createBlogDto: CreateBlogsDto) {
    return {
      name: createBlogDto.name,
      description: createBlogDto.description,
      websiteUrl: createBlogDto.websiteUrl,
    };
  }

  async findAll(
    queryPagination: QueryDto,
    searchFilters: DtoQueryType,
  ): Promise<ReturnObjWithPagination> {
    const entityPagination = await this.entityPagination.posts(queryPagination);
    // const totalCount = await this.postsRepository.countDocuments([{}])
    // const pagesCount = Math.ceil(totalCount / pageSize)
    const totalCount = 0;
    const pagesCount = 0;
    const convertedFilters = await this.convertFiltersForDB.convertAll(
      searchFilters,
    );
    const pageNumber = queryPagination.pageNumber;
    const pageSize = entityPagination.pageSize;
    return {
      pagesCount: pagesCount,
      page: pageNumber,
      pageSize: pageSize,
      totalCount: totalCount,
      items: [
        {
          id: 'string',
          name: 'string',
          description: 'string',
          websiteUrl: 'string',
          createdAt: 'string',
        },
      ],
    };
  }

  async findOne(id: string) {
    return `This action returns a #${id} blog`;
  }

  async update(id: string, updateBlogDto: UpdateBlogDto) {
    return `This action updates a #${id} blog`;
  }

  async remove(id: string) {
    return `This action removes a #${id} blog`;
  }
}
