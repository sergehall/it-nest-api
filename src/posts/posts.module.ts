import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { CommentsService } from '../comments/comments.service';
import { Pagination } from '../infrastructure/common/pagination/pagination';
import { DatabaseModule } from '../infrastructure/database/database.module';
import { CaslModule } from '../ability/casl.module';
import { postsProviders } from './posts.providers';
import { BlogsService } from '../blogs/blogs.service';
import { ConvertFiltersForDB } from '../infrastructure/common/convert-filters/convertFiltersForDB';
import { BlogsRepository } from '../blogs/blogs.repository';
import { PostsRepository } from './posts.repository';
import { CommentsRepository } from '../comments/comments.repository';

@Module({
  imports: [DatabaseModule, CaslModule],
  controllers: [PostsController],
  providers: [
    PostsService,
    CommentsService,
    CommentsRepository,
    ConvertFiltersForDB,
    BlogsService,
    BlogsRepository,
    Pagination,
    PostsRepository,
    ...postsProviders,
  ],
})
export class PostsModule {}
