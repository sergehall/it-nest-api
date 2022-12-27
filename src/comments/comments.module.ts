import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { Pagination } from '../infrastructure/common/pagination/pagination';
import { commentsProviders } from './comments.providers';
import { DatabaseModule } from '../infrastructure/database/database.module';
import { CaslModule } from '../ability/casl.module';
import { CommentsRepository } from './comments.repository';

@Module({
  imports: [DatabaseModule, CaslModule],
  controllers: [CommentsController],
  providers: [
    CommentsService,
    CommentsRepository,
    Pagination,
    ...commentsProviders,
  ],
})
export class CommentsModule {}
