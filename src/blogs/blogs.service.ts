import { CreateBlogsDto } from './dto/create-blogs.dto';
import { Injectable } from '@nestjs/common';
import { DtoQueryType, ReturnObjWithPagination } from '../types/types';
import { ConvertFiltersForDB } from '../infrastructure/common/convertFiltersForDB';
import { QueryDto } from '../infrastructure/common/manual-parse-queries/dto/query-dto';
import { UpdateBlogDto } from './dto/update-blods.dto';
import { Pagination } from '../infrastructure/common/pagination';

@Injectable()
export class BlogsService {
  constructor(
    protected convertFiltersForDB: ConvertFiltersForDB,
    protected pagination: Pagination,
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
    let field = 'createdAt';
    if (
      queryPagination.sortBy === 'name' ||
      queryPagination.sortBy === 'websiteUrl' ||
      queryPagination.sortBy === 'description'
    ) {
      field = queryPagination.sortBy;
    }

    const pagination = await this.pagination.prepare(queryPagination, field);
    // const totalCount = await this.postsRepository.countDocuments([{}])
    // const pagesCount = Math.ceil(totalCount / pageSize)
    const totalCount = 0;
    const pagesCount = 0;
    const convertedFilters = await this.convertFiltersForDB.convertAll(
      searchFilters,
    );
    const pageNumber = queryPagination.pageNumber;
    const pageSize = pagination.pageSize;
    const blog = {
      id: 'string',
      name: 'string',
      description: 'string',
      websiteUrl: 'string',
      createdAt: '2022-12-12T10:13:39.557Z',
    };
    return {
      pagesCount: pagesCount,
      page: pageNumber,
      pageSize: pageSize,
      totalCount: totalCount,
      items: [blog],
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
