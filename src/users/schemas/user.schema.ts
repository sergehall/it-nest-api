import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { Role } from '../../auth/roles/role.enum';
import { ObjectId } from 'mongodb';
import * as uuid4 from 'uuid4';
import { CreateUserDto } from '../dto/create-user.dto';
import { RegistrationData } from '../../types/types';

export type UserDocument = HydratedDocument<User>;

export interface IUser {
  id: ObjectId;
  login: string;
  email: string;
  passwordHash: string;
  createdAt: string;
  orgId: string;
  roles: Role;
  emailConfirmation: {
    confirmationCode: string;
    expirationDate: string;
    isConfirmed: boolean;
    isConfirmedDate: string;
    sentEmail: string[];
  };
  registrationData: {
    ip: string;
    userAgent: string;
  };
}

export interface IUserMethods extends Model<IUser> {
  makeInstance(
    createUserDto: CreateUserDto,
    passwordHash: string,
    registrationData: RegistrationData,
  ): Promise<IUser>;
}

export interface UserModel extends Model<IUser, IUserMethods> {
  createWithFullName(
    name: string,
  ): Promise<HydratedDocument<IUser, IUserMethods>>;
}

@Schema()
export class UserEmailConfirmation {
  @Prop({ required: true })
  confirmationCode: string;
  @Prop({ required: true })
  expirationDate: string;
  @Prop({ required: true })
  isConfirmed: boolean;
  @Prop({ required: true })
  isConfirmedDate: string;
  @Prop({ required: true })
  sentEmail: string[];
}
@Schema()
export class UserRegistrationData {
  @Prop({ required: true })
  confirmationCode: string;
  @Prop({ required: true })
  expirationDate: string;
  @Prop({ required: true })
  isConfirmed: boolean;
  @Prop({ required: true })
  isConfirmedDate: string;
  @Prop({ required: true, default: [] })
  sentEmail: string[];
}

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  id: ObjectId;
  @Prop({ required: true, unique: true })
  login: string;
  @Prop({ required: true, unique: true })
  email: string;
  @Prop({ required: true, unique: true })
  passwordHash: string;
  @Prop({ required: true })
  createdAt: string;
  @Prop({ required: true })
  orgId: string;
  @Prop({ required: true })
  roles: Role;
  @Prop({ required: true })
  emailConfirmation: UserEmailConfirmation;
  @Prop({ required: true })
  registrationData: UserRegistrationData;
}

export const UserSchema = SchemaFactory.createForClass(User);

// UserSchema.statics.makeInstance = async function makeInstance(
//   createUserDto: CreateUserDto,
//   passwordHash: string,
//   registrationData: RegistrationData,
// ) {
//   return {
//     id: new ObjectId(),
//     login: createUserDto.login,
//     email: createUserDto.email,
//     passwordHash: passwordHash,
//     createdAt: new Date().toISOString(),
//     orgId: 'It-Incubator',
//     roles: Role.User,
//     emailConfirmation: {
//       confirmationCode: uuid4().toString(),
//       expirationDate: new Date(Date.now() + 65 * 60 * 1000).toISOString(),
//       isConfirmed: false,
//       isConfirmedDate: 'None',
//       sentEmail: [],
//     },
//     registrationData: {
//       ip: registrationData.ip,
//       userAgent: registrationData.userAgent,
//     },
//   };
// };

UserSchema.static(
  'makeInstance',
  async function makeInstance(
    createUserDto: CreateUserDto,
    passwordHash: string,
    registrationData: RegistrationData,
  ) {
    return {
      id: new ObjectId(),
      login: createUserDto.login,
      email: createUserDto.email,
      passwordHash: passwordHash,
      createdAt: new Date().toISOString(),
      orgId: 'It-Incubator',
      roles: Role.User,
      emailConfirmation: {
        confirmationCode: uuid4().toString(),
        expirationDate: new Date(Date.now() + 65 * 60 * 1000).toISOString(),
        isConfirmed: false,
        isConfirmedDate: 'None',
        sentEmail: [],
      },
      registrationData: {
        ip: registrationData.ip,
        userAgent: registrationData.userAgent,
      },
    };
  },
);

// UserSchema.static.makeInstance = async function (
//   createUserDto: CreateUserDto,
//   passwordHash: string,
//   registrationData: RegistrationData,
// ) {
//   return {
//     id: new ObjectId(),
//     login: createUserDto.login,
//     email: createUserDto.email,
//     passwordHash: passwordHash,
//     createdAt: new Date().toISOString(),
//     orgId: 'It-Incubator',
//     roles: Role.User,
//     emailConfirmation: {
//       confirmationCode: uuid4().toString(),
//       expirationDate: new Date(Date.now() + 65 * 60 * 1000).toISOString(),
//       isConfirmed: false,
//       isConfirmedDate: 'None',
//       sentEmail: [],
//     },
//     registrationData: {
//       ip: registrationData.ip,
//       userAgent: registrationData.userAgent,
//     },
//   };
// };
