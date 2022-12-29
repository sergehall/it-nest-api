import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { Pagination } from '../infrastructure/common/pagination/pagination';
import { commentsProviders } from './infrastructure/comments.providers';
import { DatabaseModule } from '../infrastructure/database/database.module';
import { CaslModule } from '../ability/casl.module';
import { CommentsRepository } from './infrastructure/comments.repository';
import { LikeStatusCommentsRepository } from './infrastructure/like-status-comments.repository';
import { PostsRepository } from '../posts/infrastructure/posts.repository';
import { PostsService } from '../posts/posts.service';
import { LikeStatusPostsRepository } from '../posts/infrastructure/like-status-posts.repository';

@Module({
  imports: [DatabaseModule, CaslModule],
  controllers: [CommentsController],
  providers: [
    CommentsService,
    CommentsRepository,
    PostsService,
    PostsRepository,
    LikeStatusPostsRepository,
    LikeStatusCommentsRepository,
    Pagination,
    ...commentsProviders,
  ],
})
export class CommentsModule {}
