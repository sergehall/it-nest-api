import { BlogsEntity } from '../../../../blogs/entities/blogs.entity';
import { UsersEntity } from '../../../../users/entities/users.entity';
import { SortOrder } from '../../parse-query/types/sort-order.types';
import { PostsEntity } from '../../../../posts/entities/posts.entity';
import { CommentsEntity } from '../../../../comments/entities/comment.entity';

export type PaginationTypes = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: PostsEntity[] | CommentsEntity[] | BlogsEntity[] | UsersEntity[];
};
export type PaginationDBType = {
  startIndex: number;
  pageSize: number;
  field: string;
  direction: SortOrder;
};
