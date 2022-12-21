import { CommentType, PostsType } from '../../../types/types';
import { BlogsEntity } from '../../../blogs/entities/blogs.entity';
import { UsersEntity } from '../../../users/entities/users.entity';

export type PaginationWithItems = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: PostsType[] | CommentType[] | BlogsEntity[] | UsersEntity[];
};
