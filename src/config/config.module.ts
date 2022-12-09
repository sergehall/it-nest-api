import { ConfigService } from './config.service';
import { ConfigurableModuleClass } from './config.module-definition';
import { Module } from '@nestjs/common';

@Module({
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule extends ConfigurableModuleClass {}
