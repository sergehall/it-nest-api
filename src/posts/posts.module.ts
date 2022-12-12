import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { CommentsService } from '../comments/comments.service';
import { Pagination } from '../infrastructure/common/pagination';

@Module({
  controllers: [PostsController],
  providers: [PostsService, CommentsService, Pagination],
})
export class PostsModule {}
