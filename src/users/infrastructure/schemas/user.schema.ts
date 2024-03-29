import { Role } from '../../../ability/roles/role.enum';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { CreateUserDto } from '../../dto/create-user.dto';
import * as uuid4 from 'uuid4';
import * as bcrypt from 'bcrypt';
import { RegistrationData } from '../../entities/users.entity';
import { OrgIdEnums } from '../../../infrastructure/database/enums/org-id.enums';

export type UsersDocument = HydratedDocument<User>;

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
  @Prop({ required: true, default: [] })
  sentEmail: string[];
}
@Schema()
export class UserRegistrationData {
  @Prop({ required: true })
  ip: string;
  @Prop({ required: true })
  userAgent: string;
}
// _id: ObjectId;
@Schema()
export class User {
  @Prop({ required: true, unique: true })
  id: string;
  @Prop({ required: true, unique: true })
  login: string;
  @Prop({ required: true, unique: true })
  email: string;
  @Prop({ required: true, unique: true })
  passwordHash: string;
  @Prop({ required: true })
  createdAt: string;
  @Prop({ required: true })
  orgId: OrgIdEnums;
  @Prop({ required: true })
  roles: Role;
  @Prop({ required: true })
  emailConfirmation: UserEmailConfirmation;
  @Prop({ required: true })
  registrationData: UserRegistrationData;
  async setOrgId(organization: OrgIdEnums) {
    this.orgId = organization;
  }
  async setRoles(role: Role) {
    this.roles = role;
  }
  async setPasswordHash(password: string) {
    const saltRounds = Number(process.env.SALT_FACTOR);
    const salt = await bcrypt.genSalt(saltRounds);
    this.passwordHash = await bcrypt.hash(password, salt);
  }

  static async makeInstanceUser(
    createUserDto: CreateUserDto,
    registrationData: RegistrationData,
    userModel: UsersModelsType,
  ): Promise<UsersDocument> {
    const confirmationCode = uuid4().toString();
    const id = uuid4().toString();
    const saltRounds = Number(process.env.SALT_FACTOR);
    const salt = await bcrypt.genSalt(saltRounds);
    const passwordHash = await bcrypt.hash(createUserDto.password, salt);
    const expirationDate = new Date(Date.now() + 65 * 60 * 1000).toISOString();
    const createdAt = new Date().toISOString();
    const makeInstance = await new userModel();
    makeInstance.id = id;
    makeInstance.login = createUserDto.login;
    makeInstance.email = createUserDto.email.toLowerCase();
    makeInstance.passwordHash = passwordHash;
    makeInstance.createdAt = createdAt;
    makeInstance.orgId = OrgIdEnums.IT_INCUBATOR;
    makeInstance.roles = Role.User;
    makeInstance.emailConfirmation = {
      confirmationCode: confirmationCode,
      expirationDate: expirationDate,
      isConfirmed: false,
      isConfirmedDate: 'None',
      sentEmail: [],
    };
    makeInstance.registrationData = {
      ip: registrationData.ip,
      userAgent: registrationData.userAgent,
    };
    return makeInstance;
  }
}
export const UsersSchema = SchemaFactory.createForClass(User);

UsersSchema.methods = {
  setOrgId: User.prototype.setOrgId,
  setRoles: User.prototype.setRoles,
  setPasswordHash: User.prototype.setPasswordHash,
};
const userStaticMethods: StaticUsersMethodsType = {
  makeInstanceUser: User.makeInstanceUser,
};
UsersSchema.statics = userStaticMethods;

export type StaticUsersMethodsType = {
  makeInstanceUser: (
    createUserDto: CreateUserDto,
    registrationData: RegistrationData,
    userModel: UsersModelsType,
  ) => Promise<UsersDocument>;
};

export type UsersModelsType = Model<UsersDocument> & StaticUsersMethodsType;
