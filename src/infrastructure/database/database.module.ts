import { Module } from '@nestjs/common';
import { databaseProviders } from './database.providers';
import { SkipThrottle } from '@nestjs/throttler';

@SkipThrottle()
@Module({
  providers: [...databaseProviders],
  exports: [...databaseProviders],
})
export class DatabaseModule {}
