import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { UserType } from '../types/types';
import { Model } from 'mongoose';
import { UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersRepository {
  constructor(
    @Inject('USER_MODEL')
    private usersModel: Model<UserDocument>,
  ) {}
  async create(user: UserType) {
    try {
      return await this.usersModel.create(user);
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }
}
