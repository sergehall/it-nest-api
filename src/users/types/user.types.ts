import { Role } from '../../auth/roles/role.enum';

export type EmailConfirmation = {
  confirmationCode: string;
  expirationDate: string;
  isConfirmed: boolean;
  isConfirmedDate: string;
  sentEmail: string[];
};
export type RegistrationData = {
  ip: string;
  userAgent: string;
};
export type UserType = {
  id: string;
  login: string;
  email: string;
  passwordHash: string;
  createdAt: string;
  orgId: string;
  roles: Role;
  emailConfirmation: EmailConfirmation;
  registrationData: RegistrationData;
};

// export interface User {
//   id: string;
//   login: string;
//   email: string;
//   passwordHash: string;
//   createdAt: string;
//   orgId: string;
//   roles: Role;
//   emailConfirmation: EmailConfirmation;
//   registrationData: RegistrationData;
// }

// export const constUser: UserType = {
//   id: 'string',
//   login: 'string',
//   email: 'string',
//   passwordHash: 'string',
//   createdAt: 'string',
//   orgId: 'string',
//   roles: Role.User,
//   emailConfirmation: {
//     confirmationCode: 'string',
//     expirationDate: 'string',
//     isConfirmed: false,
//     isConfirmedDate: 'string',
//     sentEmail: [],
//   },
//   registrationData: {
//     ip: 'string',
//     userAgent: 'string',
//   },
// };

// export class User {
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
//     isConfirmedDate: string;
//     sentEmail: string[];
//   };
//   registrationData: {
//     ip: string;
//     userAgent: string;
//   };
// }
// export const newInstance = new CurrentUser();
// newInstance.id = uuid4().toString();
// newInstance.orgId = 'It-Incubator';
// newInstance.roles = Role.Admin;
