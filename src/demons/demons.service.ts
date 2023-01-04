import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { Last10secReqRepository } from '../auth/infrastructure/last10sec-req..repository';
import { MailsService } from '../mails/mails.service';
import { MailsRepository } from '../mails/infrastructure/mails.repository';

@Injectable()
export class DemonsService {
  constructor(
    private last10secReqRepository: Last10secReqRepository,
    private mailService: MailsService,
    private mailsRepository: MailsRepository,
  ) {}
  @Cron('0 */5 * * * *')
  async clearingIpOlder10Sec() {
    await this.last10secReqRepository.cleanup();
    console.log('0 */5 * * * * : clearingIpOlder10Sec');
  }
  @Cron('0 */1 * * * *')
  async sendAndDeleteConfirmationCode() {
    const emailAndCode = await this.mailsRepository.findEmailByOldestDate();
    // if (emailAndCode) {
    //   await this.mailService.sendCodeByRegistration(emailAndCode);
    // }
    console.log('0 */1 * * * * : sendAndDeleteConfirmationCode');
  }
}
