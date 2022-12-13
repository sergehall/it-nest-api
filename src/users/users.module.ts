import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { ConvertFiltersForDB } from '../infrastructure/common/convertFiltersForDB';
import { Pagination } from '../infrastructure/common/pagination';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    JwtService,
    ConvertFiltersForDB,
    Pagination,
    AuthService,
  ],
  exports: [UsersService],
})
export class UsersModule {}
