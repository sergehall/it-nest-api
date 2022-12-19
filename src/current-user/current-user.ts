import { Role } from "../auth/roles/role.enum";
import { ObjectId } from "mongodb";
import * as uuid4 from "uuid4";
import { User } from "src/users/schemas/user.schema";

export class UserCreator {
  async convertToClass(user: User) {
    const newUser = new User();
    return {
      id: newUser.id,
      login: newUser.login,
      email: newUser.email,
      passwordHash: newUser.passwordHash,
      createdAt: newUser.createdAt,
      orgId: newUser.orgId,
      roles: newUser.roles,
      emailConfirmation: {
        confirmationCode: newUser.emailConfirmation.confirmationCode,
        expirationDate: newUser.emailConfirmation.expirationDate,
        isConfirmed: newUser.emailConfirmation.isConfirmed,
        sentEmail: newUser.emailConfirmation.sentEmail
      },
      registrationData: {
        ip: newUser.registrationData.ip,
        userAgent: newUser.registrationData.userAgent
      }
    };
  }
}
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
//     sentEmail: string[];
//   };
//   registrationData: {
//     ip: string;
//     userAgent: string;
//   };
// }

// export const currentUser = new User();
// currentUser.id = uuid4().toString();
// currentUser.orgId = 'It-Incubator';
// currentUser.roles = Role.Admin;
