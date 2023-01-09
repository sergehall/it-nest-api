import { Injectable } from '@nestjs/common';
import { EmailConfimCodeEntity } from './entities/email-confim-code.entity';
import { MailsAdapter } from './adapters/mails.adapter';

@Injectable()
export class MailsService {
  constructor(private emailsAdapter: MailsAdapter) {}
  sendCodeByRegistration(emailAndCode: EmailConfimCodeEntity) {
    return this.emailsAdapter.sendCodeByRegistration(emailAndCode);
  }
}
