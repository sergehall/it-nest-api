import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { Last10secReqRepository } from './infrastructure/last10sec-req..repository';
import { DatabaseModule } from '../infrastructure/database/database.module';
import { UsersRepository } from '../users/infrastructure/users.repository';
import { authProviders } from './infrastructure/auth.providers';
import { BlacklistRefreshJwtRepository } from './infrastructure/blacklist-refresh-jwt.repository';

@Module({
  imports: [DatabaseModule, UsersModule, PassportModule, JwtModule],
  controllers: [AuthController],
  providers: [
    UsersRepository,
    AuthService,
    LocalStrategy,
    JwtStrategy,
    Last10secReqRepository,
    BlacklistRefreshJwtRepository,
    ...authProviders,
  ],
  exports: [AuthService],
})
export class AuthModule {}
