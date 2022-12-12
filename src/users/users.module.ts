import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { ConvertFiltersForDB } from '../infrastructure/common/convertFiltersForDB';

@Module({
  controllers: [UsersController],
  providers: [UsersService, ConvertFiltersForDB],
})
export class UsersModule {}
