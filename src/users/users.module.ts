import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { ConvertFiltersForDB } from '../infrastructure/common/convertFiltersForDB';
import { Pagination } from '../infrastructure/common/pagination';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { CaslModule } from '../ability/casl.module';
import { UsersRepository } from './users.repository';
import { usersProviders } from './users.providers';
import { DatabaseModule } from '../infrastructure/database/database.module';

@Module({
  imports: [DatabaseModule, CaslModule],
  controllers: [UsersController],
  providers: [
    UsersService,
    JwtService,
    ConvertFiltersForDB,
    Pagination,
    AuthService,
    UsersRepository,
    ...usersProviders,
  ],
  exports: [UsersService],
})
export class UsersModule {}
