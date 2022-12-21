import { UserType } from '../../../users/types/user.types';
import { CommentType, PostsType } from '../../../types/types';
import { BlogsEntity } from '../../../blogs/entities/blogs.entity';

export type PaginationWithItems = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: PostsType[] | CommentType[] | BlogsEntity[] | UserType[];
};
