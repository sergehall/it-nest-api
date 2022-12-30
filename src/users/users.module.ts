import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { ConvertFiltersForDB } from '../infrastructure/common/convert-filters/convertFiltersForDB';
import { Pagination } from '../infrastructure/common/pagination/pagination';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { CaslModule } from '../ability/casl.module';
import { UsersRepository } from './infrastructure/users.repository';
import { usersProviders } from './infrastructure/users.providers';
import { DatabaseModule } from '../infrastructure/database/database.module';

@Module({
  imports: [DatabaseModule, CaslModule],
  controllers: [UsersController],
  providers: [
    UsersService,
    Pagination,
    AuthService,
    UsersRepository,
    JwtService,
    ConvertFiltersForDB,
    ...usersProviders,
  ],
  exports: [UsersService],
})
export class UsersModule {}
