import { ForbiddenException, Inject } from '@nestjs/common';
import { ProvidersEnums } from '../../infrastructure/database/enums/providers.enums';
import { EmailConfimCodeEntity } from '../entities/email-confim-code.entity';
import { Model } from 'mongoose';
import { EmailsConfirmCodeDocument } from './schemas/email-confirm-code.schema';

export class MailsRepository {
  constructor(
    @Inject(ProvidersEnums.CONFIRM_CODE)
    private EmailsConfirmCodeModel: Model<EmailsConfirmCodeDocument>,
  ) {}
  async insertEmailConfirmCode(newConfirmationCode: EmailConfimCodeEntity) {
    try {
      return await this.EmailsConfirmCodeModel.create(newConfirmationCode);
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }
  async findEmailByOldestDate(): Promise<EmailConfimCodeEntity | null> {
    const findEmail = await this.EmailsConfirmCodeModel.find({}, { _id: false })
      .sort({ createdAt: 1 })
      .limit(1);
    if (findEmail.length === 0) {
      return null;
    }
    return findEmail[0];
  }
  async removeEmailById(id: string): Promise<boolean> {
    const result = await this.EmailsConfirmCodeModel.deleteOne({ id: id });
    return result.deletedCount !== 0;
  }
}