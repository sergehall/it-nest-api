import { Module } from '@nestjs/common';
import { DemonsService } from './demons.service';
import { DemonsController } from './demons.controller';
import { demonsProviders } from './infrastructure/demons.providers';
import { DatabaseModule } from '../infrastructure/database/database.module';
import { Last10secReqRepository } from '../auth/infrastructure/last10sec-req..repository';
import { MailsModule } from '../mails/mails.module';
import { MailsRepository } from '../mails/infrastructure/mails.repository';

@Module({
  imports: [DatabaseModule, MailsModule],
  controllers: [DemonsController],
  providers: [
    DemonsService,
    Last10secReqRepository,
    MailsRepository,
    ...demonsProviders,
  ],
})
export class DemonsModule {}
