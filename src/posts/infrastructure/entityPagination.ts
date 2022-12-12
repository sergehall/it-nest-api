import { Injectable } from '@nestjs/common';
import { QueryDto } from '../../infrastructure/common/manual-parse-queries/dto/query-dto';
import { EntityPaginationType } from '../../types/types';
import { Pagination } from '../../infrastructure/common/pagination';

@Injectable()
export class EntityPagination {
  constructor(protected pagination: Pagination) {}

  async posts(queryPagination: QueryDto): Promise<EntityPaginationType> {
    let field = 'createdAt';
    if (
      queryPagination.sortBy === 'title' ||
      queryPagination.sortBy === 'shortDescription' ||
      queryPagination.sortBy === 'blogName' ||
      queryPagination.sortBy === 'content'
    ) {
      field = queryPagination.sortBy;
    }
    console.log(field);
    return this.pagination.prepare(queryPagination, field);
  }
}
