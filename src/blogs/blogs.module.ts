import { Module } from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { BlogsController } from './blogs.controller';
import { ConvertFiltersForDB } from '../infrastructure/common/convertFiltersForDB';
import { PostsService } from '../posts/posts.service';
import { EntityPagination } from '../posts/infrastructure/entityPagination';
import { Pagination } from '../infrastructure/common/pagination';

@Module({
  controllers: [BlogsController],
  providers: [
    BlogsService,
    PostsService,
    ConvertFiltersForDB,
    EntityPagination,
    Pagination,
  ],
})
export class BlogsModule {}
