import { Injectable } from '@nestjs/common';
import { PaginationDto } from './dto/pagination.dto';
import { EntityPaginationType } from '../../types/types';

@Injectable()
export class Pagination {
  async prepare(
    queryPagination: PaginationDto,
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
