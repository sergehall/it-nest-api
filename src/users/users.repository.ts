import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { UserDocument } from './schemas/user.schema';
import { PaginationDBType, QueryArrType, UserType } from '../types/types';

@Injectable()
export class UsersRepository {
  constructor(
    @Inject('USER_MODEL')
    private usersModel: Model<UserDocument>,
  ) {}
  async createUser(user: UserType): Promise<UserType> {
    try {
      return await this.usersModel.create(user);
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }

  async countDocuments(searchFilters: QueryArrType) {
    return await this.usersModel.countDocuments({
      $or: searchFilters,
    });
  }
  async findUsers(
    pagination: PaginationDBType,
    searchFilters: QueryArrType,
  ): Promise<UserType[]> {
    return await this.usersModel
      .find(
        {
          $or: searchFilters,
        },
        {
          _id: false,
          __v: false,
          passwordHash: false,
          orgId: false,
          roles: false,
          emailConfirmation: false,
          registrationData: false,
        },
      )
      .limit(pagination.pageSize)
      .skip(pagination.startIndex)
      .sort({ [pagination.field]: pagination.direction })
      .lean();
  }
  async findUserByUserId(userId: string): Promise<UserType | null> {
    return await this.usersModel.findOne(
      { id: userId },
      {
        _id: false,
        __v: false,
        'emailConfirmation._id': false,
        'registrationData._id': false,
      },
    );
  }

  async deleteUserById(id: string): Promise<boolean> {
    const result = await this.usersModel.deleteOne({ id: id });
    return result.acknowledged && result.deletedCount === 1;
  }
}
