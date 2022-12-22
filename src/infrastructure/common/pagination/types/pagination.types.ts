import { CommentType, PostsType } from '../../../../types/types';
import { BlogsEntity } from '../../../../blogs/entities/blogs.entity';
import { UsersEntity } from '../../../../users/entities/users.entity';
import { SortOrder } from '../../parse-query/types/sort-order.types';

export type PaginationTypes = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: PostsType[] | CommentType[] | BlogsEntity[] | UsersEntity[];
};
export type PaginationDBType = {
  startIndex: number;
  pageSize: number;
  field: string;
  direction: SortOrder;
};
