import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { ConvertFiltersForDB } from '../infrastructure/common/convertFiltersForDB';
import { Pagination } from '../infrastructure/common/pagination';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { CaslAbilityFactory } from '../casl/casl-ability.factory/casl-ability.factory';
import { CaslModule } from '../casl/casl.module';

@Module({
  imports: [CaslModule],
  controllers: [UsersController],
  providers: [
    UsersService,
    JwtService,
    ConvertFiltersForDB,
    Pagination,
    AuthService,
    CaslAbilityFactory,
  ],
  exports: [UsersService],
})
export class UsersModule {}
