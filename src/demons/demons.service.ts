import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { Last10secReqRepository } from '../auth/infrastructure/last10sec-req..repository';
import { MailsService } from '../mails/mails.service';
import { UsersService } from '../users/users.service';
import { BlacklistJwtRepository } from '../auth/infrastructure/blacklist-jwt.repository';

@Injectable()
export class DemonsService {
  constructor(
    private last10secReqRepository: Last10secReqRepository,
    private mailService: MailsService,
    private usersService: UsersService,
    private blacklistJwtRepository: BlacklistJwtRepository,
  ) {}
  @Cron('0 */1 * * * *')
  async clearingIpOlder10Sec() {
    await this.last10secReqRepository.cleanup();
  }
  @Cron('* * * * * *')
  async sendAndDeleteConfirmationCode() {
    const emailAndCode = await this.mailService.findEmailByOldestDate();
    if (emailAndCode) {
      await this.mailService.sendCodeByRegistration(emailAndCode);
      console.log(`send confirmation code to email:  ${emailAndCode.email}`);
      await this.usersService.addSentEmailTime(emailAndCode.email);
      await this.mailService.removeEmailById(emailAndCode.id);
    }
  }
  @Cron('0 */5 * * * *')
  async clearingInvalidJWTFromBlackList() {
    await this.blacklistJwtRepository.clearingInvalidJWTFromBlackList();
  }
}
