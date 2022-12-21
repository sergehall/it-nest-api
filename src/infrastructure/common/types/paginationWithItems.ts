import { BlogEntity } from '../../../blogs/entities/blog.entity';
import { UserType } from '../../../users/types/user.types';
import { CommentType, PostsType } from '../../../types/types';

export type PaginationWithItems = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: PostsType[] | CommentType[] | BlogEntity[] | UserType[];
};
