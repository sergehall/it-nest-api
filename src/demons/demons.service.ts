import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { Last10secReqRepository } from '../auth/infrastructure/last10sec-req..repository';
import { MailsService } from '../mails/mails.service';
import { MailsRepository } from '../mails/infrastructure/mails.repository';
import { UsersService } from '../users/users.service';
import { BlacklistJwtRepository } from '../auth/infrastructure/blacklist-jwt.repository';

@Injectable()
export class DemonsService {
  constructor(
    private last10secReqRepository: Last10secReqRepository,
    private mailService: MailsService,
    private mailsRepository: MailsRepository,
    private usersService: UsersService,
    private blacklistJwtRepository: BlacklistJwtRepository,
  ) {}
  @Cron('0 */5 * * * *')
  async clearingIpOlder10Sec() {
    await this.last10secReqRepository.cleanup();
    console.log('0 */5 * * * * : clearingIpOlder10Sec');
  }
  @Cron('* * * * * *')
  async sendAndDeleteConfirmationCode() {
    const emailAndCode = await this.mailsRepository.findEmailByOldestDate();
    if (emailAndCode) {
      await this.mailService.sendCodeByRegistration(emailAndCode);
      await this.usersService.addSentEmailTime(emailAndCode.email);
      await this.mailsRepository.removeEmailById(emailAndCode.id);
    }
    // console.log('* * * * * * : sendAndDeleteConfirmationCode');
  }
  @Cron('0 */5 * * * *')
  async clearingInvalidJWTFromBlackList() {
    await this.blacklistJwtRepository.clearingInvalidJWTFromBlackList();
    console.log('0 */5 * * * * : clearingInvalidJWTFromBlackList');
  }
}
