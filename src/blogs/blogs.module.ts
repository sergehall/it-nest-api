import { Module } from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { BlogsController } from './blogs.controller';
import { ConvertFiltersForDB } from '../infrastructure/common/convertFiltersForDB';
import { PostsService } from '../posts/posts.service';
import { Pagination } from '../infrastructure/common/pagination';
import { BlogsRepository } from './blogs.repository';
import { DatabaseModule } from '../infrastructure/database/database.module';
import { blogsProviders } from './blogs.providers';
import { CaslAbilityFactory } from '../ability/casl-ability.factory';
import { CaslModule } from '../ability/casl.module';

@Module({
  imports: [DatabaseModule, CaslModule],
  controllers: [BlogsController],
  providers: [
    BlogsService,
    PostsService,
    ConvertFiltersForDB,
    BlogsRepository,
    Pagination,
    CaslAbilityFactory,
    ...blogsProviders,
  ],
})
export class BlogsModule {}
