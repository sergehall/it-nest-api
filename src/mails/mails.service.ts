import { Injectable } from '@nestjs/common';
import { EmailConfimCodeEntity } from './entities/email-confim-code.entity';
import { MailsAdapter } from './adapters/mails.adapter';
import { MailsRepository } from './infrastructure/mails.repository';

@Injectable()
export class MailsService {
  constructor(
    private emailsAdapter: MailsAdapter,
    private mailsRepository: MailsRepository,
  ) {}
  async sendCodeByRegistration(emailAndCode: EmailConfimCodeEntity) {
    return await this.emailsAdapter.sendCodeByRegistration(emailAndCode);
  }
  async findEmailByOldestDate() {
    return await this.mailsRepository.findEmailByOldestDate();
  }
  async removeEmailById(id: string): Promise<boolean> {
    return await this.mailsRepository.removeEmailById(id);
  }
}
