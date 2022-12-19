import { Role } from '../../auth/roles/role.enum';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ObjectId } from 'mongodb';

export type UserDocument = HydratedDocument<User>;

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
  ip: string;
  @Prop({ required: true })
  userAgent: string;
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

// export interface IUser {
//   id: string;
//   login: string;
//   email: string;
//   passwordHash: string;
//   createdAt: string;
//   orgId: string;
//   roles: Role;
//   emailConfirmation: {
//     confirmationCode: string;
//     expirationDate: string;
//     isConfirmed: boolean;
//     sentEmail: string[];
//   };
//   registrationData: {
//     ip: string;
//     userAgent: string;
//   };
// }
// export interface IUserMethods {
//   generateHash(password: string): string;
// }
// // eslint-disable-next-line @typescript-eslint/ban-types
// export interface IUserModel extends Model<IUser, {}, IUserMethods, Document> {
//   makeInstance(
//     createUserDto: CreateUserDto,
//     passwordHash: string,
//     registrationData: RegistrationData,
//   ): Promise<HydratedDocument<IUser, IUserMethods>>;
// }
// // // eslint-disable-next-line @typescript-eslint/ban-types
// // export interface IUserModel extends Model<IUser, {}, IUserMethods, Document> {
// //   makeInstance(
// //     createUserDto: CreateUserDto,
// //     passwordHash: string,
// //     registrationData: RegistrationData,
// //   ): Promise<HydratedDocument<IUser, IUserMethods>>;
// // }
// export const UsersSchema = new Schema<IUser, IUserModel, IUserMethods>({
//   id: { type: String, required: true },
//   login: { type: String, required: true },
//   email: { type: String, required: true },
//   passwordHash: { type: String, required: true },
//   createdAt: { type: String, required: true },
//   orgId: { type: String, required: true },
//   roles: { type: String, required: true },
//   emailConfirmation: {
//     confirmationCode: { type: String, required: true },
//     expirationDate: { type: String, required: true },
//     isConfirmed: { type: Boolean, required: true },
//     sentEmail: { type: [], required: true },
//   },
//   registrationData: {
//     ip: { type: String, required: true },
//     userAgent: { type: String, required: true },
//   },
// });
//
// UsersSchema.static(
//   'makeInstance',
//   async function makeInstance(
//     createUserDto: CreateUserDto,
//     passwordHash: string,
//     registrationData: RegistrationData,
//   ) {
//     const confirmationCode = uuid4().toString();
//     return await this.create({
//       id: new ObjectId(),
//       login: createUserDto.login,
//       email: createUserDto.email,
//       passwordHash: passwordHash,
//       createdAt: new Date().toISOString(),
//       orgId: 'It-Incubator',
//       roles: Role.User,
//       emailConfirmation: {
//         confirmationCode: confirmationCode,
//         expirationDate: new Date(Date.now() + 65 * 60 * 1000).toISOString(),
//         isConfirmed: false,
//         isConfirmedDate: 'None',
//         sentEmail: [],
//       },
//       registrationData: {
//         ip: registrationData.ip,
//         userAgent: registrationData.userAgent,
//       },
//     });
//   },
// );
// UsersSchema.method(
//   'generateHash',
//   async function (password: string): Promise<string> {
//     const saltRounds = Number(process.env.SALT_FACTOR);
//     const salt = await bcrypt.genSalt(saltRounds);
//     return bcrypt.hash(password, salt);
//   },
// );
//
// }
// //
// // export interface User extends Document {
// //   id: string;
// //   login: string;
// //   email: string;
// //   passwordHash: string;
// //   createdAt: string;
// //   orgId: string;
// //   roles: Role;
// //   emailConfirmation: {
// //     confirmationCode: string;
// //     expirationDate: string;
// //     isConfirmed: boolean;
// //     sentEmail: string[];
// //   };
// //   registrationData: {
// //     ip: string | null;
// //     userAgent: string;
// //   };
// // }
//
// export interface IUserMethods {
//   loginAndEmail(): string;
//   generateHash(password: string): string;
// }
//
// export interface IUserStaticMethods {
//   makeInstance(
//     createUserDto: CreateUserDto,
//     passwordHash: string,
//     registrationData: RegistrationData,
//   ): User;
// }
//
// export const UserSchema = new mongoose.Schema<
//   User & IUserMethods & IUserStaticMethods
// >();
//
// UserSchema.statics.makeInstance = async function (
//   createUserDto: CreateUserDto,
//   passwordHash: string,
//   registrationData: RegistrationData,
// ) {
//   const confirmationCode = uuid4().toString();
//   return {
//     id: new ObjectId(),
//     login: createUserDto.login,
//     email: createUserDto.email,
//     passwordHash: passwordHash,
//     createdAt: new Date().toISOString(),
//     orgId: 'It-Incubator',
//     roles: Role.User,
//     emailConfirmation: {
//       confirmationCode: confirmationCode,
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
//
// UserSchema.method('generateHash', async function (password: string) {
//   const saltRounds = Number(process.env.SALT_FACTOR);
//   return await bcrypt.genSalt(saltRounds);
// });
// UserSchema.method(
//   'loginAndEmail',
//   async function loginAndEmail(): Promise<string> {
//     return this.login + ' ' + this.email;
//   },
// );
// // UserSchema.static(
// //   'makeInstance',
// //   async function makeInstance(
// //     createUserDto: CreateUserDto,
// //     passwordHash: string,
// //     registrationData: RegistrationData,
// //   ) {
// //     const confirmationCode = uuid4().toString();
// //     return {
// //       id: new ObjectId(),
// //       login: createUserDto.login,
// //       email: createUserDto.email,
// //       passwordHash: passwordHash,
// //       createdAt: new Date().toISOString(),
// //       orgId: 'It-Incubator',
// //       roles: Role.User,
// //       emailConfirmation: {
// //         confirmationCode: confirmationCode,
// //         expirationDate: new Date(Date.now() + 65 * 60 * 1000).toISOString(),
// //         isConfirmed: false,
// //         isConfirmedDate: 'None',
// //         sentEmail: [],
// //       },
// //       registrationData: {
// //         ip: registrationData.ip,
// //         userAgent: registrationData.userAgent,
// //       },
// //     };
// //   },
// // );
//
// // UserSchema.statics.makeInstance = async function makeInstance(
// //   createUserDto: CreateUserDto,
// //   passwordHash: string,
// //   registrationData: RegistrationData,
// // ) {
// //   return {
// //     id: new ObjectId(),
// //     login: createUserDto.login,
// //     email: createUserDto.email,
// //     passwordHash: passwordHash,
// //     createdAt: new Date().toISOString(),
// //     orgId: 'It-Incubator',
// //     roles: Role.User,
// //     emailConfirmation: {
// //       confirmationCode: uuid4().toString(),
// //       expirationDate: new Date(Date.now() + 65 * 60 * 1000).toISOString(),
// //       isConfirmed: false,
// //       isConfirmedDate: 'None',
// //       sentEmail: [],
// //     },
// //     registrationData: {
// //       ip: registrationData.ip,
// //       userAgent: registrationData.userAgent,
// //     },
// //   };
// // };
//
// export type UserDocument = HydratedDocument<User>;
// @Schema()
// export class GenerateHash {
//   async generateHash(password: string): Promise<string> {
//     const saltRounds = Number(process.env.SALT_FACTOR);
//     const salt = await bcrypt.genSalt(saltRounds);
//     return bcrypt.hash(password, salt);
//   }
// }
// @Schema()
// export class MakeInstance {
//   async makeInstance(
//     createUserDto: CreateUserDto,
//     passwordHash: string,
//     registrationData: RegistrationData,
//   ): Promise<User> {
//     const confirmationCode = uuid4().toString();
//     return new Model({
//       id: new ObjectId(),
//       login: createUserDto.login,
//       email: createUserDto.email,
//       passwordHash: passwordHash,
//       createdAt: new Date().toISOString(),
//       orgId: 'It-Incubator',
//       roles: Role.User,
//       emailConfirmation: {
//         confirmationCode: confirmationCode,
//         expirationDate: new Date(Date.now() + 65 * 60 * 1000).toISOString(),
//         isConfirmed: false,
//         isConfirmedDate: 'None',
//         sentEmail: [],
//       },
//       registrationData: {
//         ip: registrationData.ip,
//         userAgent: registrationData.userAgent,
//       },
//     });
//   }
// }
// @Schema()
// export class UserEmailConfirmation {
//   @Prop({ required: true })
//   confirmationCode: string;
//   @Prop({ required: true })
//   expirationDate: string;
//   @Prop({ required: true })
//   isConfirmed: boolean;
//   @Prop({ required: true })
//   isConfirmedDate: string;
//   @Prop({ required: true })
//   sentEmail: string[];
// }
// @Schema()
// export class UserRegistrationData {
//   @Prop({ required: true })
//   ip: string;
//   @Prop({ required: true })
//   userAgent: string;
// }
// @Schema()
// export class User {
//   @Prop({ required: true, unique: true })
//   id: ObjectId;
//   @Prop({ required: true, unique: true })
//   login: string;
//   @Prop({ required: true, unique: true })
//   email: string;
//   @Prop({ required: true, unique: true })
//   passwordHash: string;
//   @Prop({ required: true })
//   createdAt: string;
//   @Prop({ required: true })
//   orgId: string;
//   @Prop({ required: true })
//   roles: Role;
//   @Prop({ required: true })
//   emailConfirmation: UserEmailConfirmation;
//   @Prop({ required: true })
//   registrationData: UserRegistrationData;
//   @Prop()
//   generateHash: GenerateHash;
//   @Prop()
//   makeInstance: MakeInstance;
// }
// export const UserSchema = SchemaFactory.createForClass(User);

// console.log('++++++++++');
// const User = mongoose.model<IUser, IUserModel>('User', UsersSchema);
// const newInstance = User.makeInstance(
//   { login: 'Login', password: 'pasword', email: 'email' },
//   'passwordHash',
//   { ip: 'string', userAgent: 'string' },
// );
// console.log(newInstance, '-------------');
