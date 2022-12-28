import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { CommentsService } from '../comments/comments.service';
import { Pagination } from '../infrastructure/common/pagination/pagination';
import { DatabaseModule } from '../infrastructure/database/database.module';
import { CaslModule } from '../ability/casl.module';
import { postsProviders } from './infrastructure/posts.providers';
import { BlogsService } from '../blogs/blogs.service';
import { ConvertFiltersForDB } from '../infrastructure/common/convert-filters/convertFiltersForDB';
import { BlogsRepository } from '../blogs/infrastructure/blogs.repository';
import { PostsRepository } from './infrastructure/posts.repository';
import { CommentsRepository } from '../comments/infrastructure/comments.repository';
import { LikeStatusPostsRepository } from './infrastructure/like-status-posts.repository';
import { LikeStatusCommentsRepository } from '../comments/infrastructure/like-status-comments.repository';

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
    LikeStatusPostsRepository,
    LikeStatusCommentsRepository,
    ...postsProviders,
  ],
})
export class PostsModule {}
