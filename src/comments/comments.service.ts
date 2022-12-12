import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { QueryDto } from '../infrastructure/common/manual-parse-queries/dto/query-dto';
import { ConvertFiltersForDB } from '../infrastructure/common/convertFiltersForDB';
import { Pagination } from '../infrastructure/common/pagination';

@Injectable()
export class CommentsService {
  constructor(protected pagination: Pagination) {}
  async create(createCommentDto: CreateCommentDto) {
    return 'This action adds a new comment';
  }

  async findAll(queryPagination: QueryDto) {
    let field = 'createdAt';
    if (
      queryPagination.sortBy === 'content' ||
      queryPagination.sortBy === 'userLogin'
    ) {
      field = queryPagination.sortBy;
    }
    const pagination = await this.pagination.prepare(queryPagination, field);
    // const totalCount = await this.commentsRepository.countDocuments....
    // const pagesCount = Math.ceil(totalCount / pageSize)
    const totalCount = 0;
    const pagesCount = 0;
    const pageNumber = queryPagination.pageNumber;
    const pageSize = pagination.pageSize;
    const comment = {
      id: 'string',
      content: 'string',
      userId: 'string',
      userLogin: 'string',
      createdAt: '2022-12-12T10:13:39.557Z',
      likesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: 'None',
      },
    };
    return {
      pagesCount: pagesCount,
      page: pageNumber,
      pageSize: pageSize,
      totalCount: totalCount,
      items: [comment],
    };
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
