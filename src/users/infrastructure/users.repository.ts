import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { UsersDocument, UsersModelsType } from './schemas/user.schema';
import { RegistrationData, UsersEntity } from '../entities/users.entity';
import { QueryArrType } from '../../infrastructure/common/convert-filters/types/convert-filter.types';
import { PaginationDBType } from '../../infrastructure/common/pagination/types/pagination.types';
import { ProvidersEnums } from '../../infrastructure/database/enums/providers.enums';
import { CreateUserDto } from '../dto/create-user.dto';

@Injectable()
export class UsersRepository {
  constructor(
    @Inject(ProvidersEnums.USER_MODEL)
    private UsersModel: UsersModelsType,
  ) {}
  async findUserByLoginOrEmail(
    loginOrEmail: string,
  ): Promise<UsersEntity | null> {
    return await this.UsersModel.findOne({
      $or: [{ login: { $eq: loginOrEmail } }, { email: { $eq: loginOrEmail } }],
    });
  }
  async userAlreadyExist(login: string, email: string): Promise<string | null> {
    const findLogin = await this.UsersModel.findOne({ login: { $eq: login } });
    const findEmail = await this.UsersModel.findOne({ email: { $eq: email } });
    if (findLogin || findEmail) {
      return findLogin ? 'login' : 'email';
    }
    return null;
  }
  async createUser(user: UsersEntity): Promise<UsersEntity> {
    try {
      return await this.UsersModel.create(user);
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }
  async makeInstanceUser(
    createUserDto: CreateUserDto,
    registrationData: RegistrationData,
  ): Promise<UsersDocument> {
    try {
      return await this.UsersModel.makeInstanceUser(
        createUserDto,
        registrationData,
        this.UsersModel,
      );
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }
  async save(newInstance: UsersDocument) {
    try {
      return await newInstance.save();
    } catch (error) {
      console.log(error);
      throw new ForbiddenException(error.message);
    }
  }

  async countDocuments(searchFilters: QueryArrType): Promise<number> {
    return await this.UsersModel.countDocuments({
      $or: searchFilters,
    });
  }
  async findUsers(
    pagination: PaginationDBType,
    searchFilters: QueryArrType,
  ): Promise<UsersEntity[]> {
    return await this.UsersModel.find(
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
  async findUserByUserId(userId: string): Promise<UsersEntity | null> {
    return await this.UsersModel.findOne(
      { id: userId },
      {
        _id: false,
        __v: false,
        'emailConfirmation._id': false,
        'registrationData._id': false,
      },
    );
  }

  async removeUserById(id: string): Promise<boolean> {
    const result = await this.UsersModel.deleteOne({ id: id });
    return result.acknowledged && result.deletedCount === 1;
  }

  async addSentEmailTime(email: string, currentTime: string) {
    return await this.UsersModel.findOneAndUpdate(
      { email: email },
      { $push: { 'emailConfirmation.sentEmail': currentTime } },
    );
  }
}
