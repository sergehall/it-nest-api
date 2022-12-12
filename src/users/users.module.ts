import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { ConvertFiltersForDB } from '../infrastructure/common/convertFiltersForDB';
import { Pagination } from '../infrastructure/common/pagination';

@Module({
  controllers: [UsersController],
  providers: [UsersService, ConvertFiltersForDB, Pagination],
})
export class UsersModule {}
