import { Injectable } from '@nestjs/common';
import { QueryDto } from './manual-parse-queries/dto/query-dto';
import { EntityPaginationType } from '../../types/types';

@Injectable()
export class Pagination {
  async prepare(
    queryPagination: QueryDto,
    field: string,
  ): Promise<EntityPaginationType> {
    const startIndex =
      (queryPagination.pageNumber - 1) * queryPagination.pageSize;
    const pageSize = queryPagination.pageSize;
    const direction = queryPagination.sortDirection;
    return {
      startIndex,
      pageSize,
      field,
      direction,
    };
  }
}
