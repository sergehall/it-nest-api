import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { Injectable } from '@nestjs/common';
import {
  DtoQueryType,
  EntityPaginationType,
  QueryPaginationType,
  ReturnObjWithPagination,
} from '../types/types';
import { ConvertFiltersForDB } from '../infrastructure/common/convertFiltersForDB';
import { QueryDto } from '../infrastructure/common/dto/query-dto';

@Injectable()
export class BlogsService {
  constructor(protected convertFiltersForDB: ConvertFiltersForDB) {}
  async create(createBlogDto: CreateBlogDto) {
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
    const pageNumber = queryPagination.pageNumber;
    const startIndex =
      (queryPagination.pageNumber - 1) * queryPagination.pageSize;
    const pageSize = queryPagination.pageSize;
    let field = 'createdAt';
    if (
      queryPagination.sortBy === 'name' ||
      queryPagination.sortBy === 'websiteUrl' ||
      queryPagination.sortBy === 'description'
    ) {
      field = queryPagination.sortBy;
    }
    const direction = queryPagination.sortDirection;
    const entityPagination: EntityPaginationType = {
      startIndex,
      pageSize,
      field,
      direction,
    };
    const convertedFilters = await this.convertFiltersForDB.convertAll(
      searchFilters,
    );
    return {
      pagesCount: 0,
      page: pageNumber,
      pageSize: pageSize,
      totalCount: 0,
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
