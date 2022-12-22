import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { Pagination } from '../infrastructure/common/pagination/pagination';

@Module({
  controllers: [CommentsController],
  providers: [CommentsService, Pagination],
})
export class CommentsModule {}
