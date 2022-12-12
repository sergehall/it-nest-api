import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { CommentsService } from '../comments/comments.service';
import { EntityPagination } from './infrastructure/entityPagination';
import { Pagination } from '../infrastructure/common/pagination';

@Module({
  controllers: [PostsController],
  providers: [EntityPagination, PostsService, CommentsService, Pagination],
})
export class PostsModule {}
