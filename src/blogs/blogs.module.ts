import { Module } from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { BlogsController } from './blogs.controller';
import { ConvertFiltersForDB } from '../infrastructure/common/convert-filters/convertFiltersForDB';
import { PostsService } from '../posts/posts.service';
import { Pagination } from '../infrastructure/common/pagination/pagination';
import { BlogsRepository } from './infrastructure/blogs.repository';
import { DatabaseModule } from '../infrastructure/database/database.module';
import { blogsProviders } from './infrastructure/blogs.providers';
import { CaslModule } from '../ability/casl.module';
import { PostsRepository } from '../posts/infrastructure/posts.repository';
import { LikeStatusPostsRepository } from '../posts/infrastructure/like-status-posts.repository';

@Module({
  imports: [DatabaseModule, CaslModule],
  controllers: [BlogsController],
  providers: [
    BlogsService,
    PostsService,
    ConvertFiltersForDB,
    BlogsRepository,
    Pagination,
    PostsRepository,
    LikeStatusPostsRepository,
    ...blogsProviders,
  ],
})
export class BlogsModule {}
