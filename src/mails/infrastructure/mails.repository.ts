import { ForbiddenException, Inject } from '@nestjs/common';
import { ProvidersEnums } from '../../infrastructure/database/enums/providers.enums';
import { EmailConfimCodeEntity } from '../entities/email-confim-code.entity';
import { EmailConfimCodeDocument } from './schemas/email-confirm-code.schema';
import { Model } from 'mongoose';

export class MailsRepository {
  constructor(
    @Inject(ProvidersEnums.CONFIRM_CODE)
    private EmailComfirmModel: Model<EmailConfimCodeDocument>,
  ) {}
  async insertEmailConfirmCode(newConfirmationCode: EmailConfimCodeEntity) {
    try {
      return await this.EmailComfirmModel.create(newConfirmationCode);
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }
  async findEmailByOldestDate(): Promise<EmailConfimCodeEntity | null> {
    const findEmail = await this.EmailComfirmModel.find({}, { _id: false })
      .sort({ createdAt: 1 })
      .limit(1);
    if (findEmail.length === 0) {
      return null;
    }
    return findEmail[0];
  }
}
