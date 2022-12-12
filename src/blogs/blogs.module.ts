import { Module } from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { BlogsController } from './blogs.controller';
import { ConvertFiltersForDB } from '../infrastructure/common/convertFiltersForDB';
import { PostsService } from '../posts/posts.service';
import { Pagination } from '../infrastructure/common/pagination';

@Module({
  controllers: [BlogsController],
  providers: [BlogsService, PostsService, ConvertFiltersForDB, Pagination],
})
export class BlogsModule {}
