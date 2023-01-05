import { Module } from '@nestjs/common';
import { MailsService } from './mails.service';
import { mailsProviders } from './infrastructure/mails.provaiders';
import { DatabaseModule } from '../infrastructure/database/database.module';
import { MailsRepository } from './infrastructure/mails.repository';

@Module({
  imports: [DatabaseModule],
  providers: [MailsService, MailsRepository, ...mailsProviders],
  exports: [MailsService], // 👈 export for DI
})
export class MailsModule {}
