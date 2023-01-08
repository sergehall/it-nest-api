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
import { AuthService } from '../auth/auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UsersRepository } from '../users/infrastructure/users.repository';
import { MailsRepository } from '../mails/infrastructure/mails.repository';
import { UserExistsRule } from '../pipes/user-exists-validation.decorator';
import { BlacklistJwtRepository } from '../auth/infrastructure/blacklist-refresh-jwt.repository';

@Module({
  imports: [DatabaseModule, CaslModule],
  controllers: [BlogsController],
  providers: [
    BlogsService,
    BlacklistJwtRepository,
    PostsService,
    ConvertFiltersForDB,
    BlogsRepository,
    AuthService,
    UsersService,
    JwtService,
    Pagination,
    PostsRepository,
    UsersRepository,
    MailsRepository,
    LikeStatusPostsRepository,
    UserExistsRule,
    ...blogsProviders,
  ],
})
export class BlogsModule {}
