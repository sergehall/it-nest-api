import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { RegistrationData } from '../types/types';
import { Model } from 'mongoose';
import { IUser, IUserMethods, UserModel } from './schemas/user.schema';

@Injectable()
export class UsersRepository {
  constructor(
    @Inject('USER_MODEL')
    private usersModel: Model<IUser, UserModel, IUserMethods>,
  ) {}
  async makeInstance(
    createUserDto: CreateUserDto,
    passwordHash: string,
    registrationData: RegistrationData,
  ) {
    // const createdUse = this.userModel({
    //   id: new ObjectId(),
    //   login: createUserDto.login,
    //   email: createUserDto.email,
    //   passwordHash: passwordHash,
    //   createdAt: new Date().toISOString(),
    //   orgId: 'It-Incubator',
    //   roles: Role.User,
    //   emailConfirmation: {
    //     confirmationCode: confirmationCode,
    //     expirationDate: new Date(Date.now() + 65 * 60 * 1000).toISOString(),
    //     isConfirmed: false,
    //     isConfirmedDate: 'None',
    //     sentEmail: [],
    //   },
    //   registrationData: {
    //     ip: registrationData.ip,
    //     userAgent: registrationData.userAgent,
    //   },
    // });
    const createdUse = new this.usersModel();
    const newInstans = createdUse.makeInstance(
      createUserDto,
      passwordHash,
      registrationData,
    );
    console.log(newInstans, '-------------');

    // const newInstance = await this.userModel.makeInstance(
    //   createUserDto,
    //   passwordHash,
    //   registrationData,
    // );

    return true;
  }
}
