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
      queryPagination.sortBy === 'name' ||
      queryPagination.sortBy === 'websiteUrl' ||
      queryPagination.sortBy === 'description'
    ) {
      field = queryPagination.sortBy;
    }
    return this.pagination.prepare(queryPagination, field);
  }
}
