import { Module } from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { BlogsController } from './blogs.controller';
import { ConvertFiltersForDB } from '../infrastructure/common/convertFiltersForDB';
import { PostsService } from '../posts/posts.service';
import { Pagination } from '../infrastructure/common/pagination';
import { BlogsRepository } from './blogs.repository';
import { DatabaseModule } from '../infrastructure/database/database.module';
import { blogsProviders } from './blogs.providers';
import { CaslModule } from '../ability/casl.module';
import { PostsRepository } from '../posts/posts.repository';

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
    ...blogsProviders,
  ],
})
export class BlogsModule {}
