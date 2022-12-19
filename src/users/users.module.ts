import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { ConvertFiltersForDB } from '../infrastructure/common/convertFiltersForDB';
import { Pagination } from '../infrastructure/common/pagination';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { CaslAbilityFactory } from '../ability/casl-ability.factory';
import { CaslModule } from '../ability/casl.module';
import { UsersRepository } from './users.repository';
import { userProviders } from './user.providers';
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
    CaslAbilityFactory,
    UsersRepository,
    UserCreator,
    ...userProviders,
  ],
  exports: [UsersService],
})
export class UsersModule {}
