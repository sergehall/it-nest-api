import { UsersEntity } from '../users/entities/users.entity';
import { OrgIdEnums } from '../infrastructure/database/enums/org-id.enums';
import { Role } from '../auth/roles/role.enum';

export const currentUser: UsersEntity | null = {
  id: 'c2b18894-8747-402e-9974-45fa4c7b41a4',
  login: 'Bob',
  email: 'bob@gmail.com',
  passwordHash: '$2b$11$.c.q/grUpeeU.SQM.NnOseR1vm.uQpniujrppjuvW/DNnMQ06Lv1C',
  createdAt: '2022-12-04T10:41:52.374Z',
  orgId: OrgIdEnums.INCUBATOR,
  roles: Role.User,
  emailConfirmation: {
    confirmationCode: 'a35ec071-d9cc-4866-b881-a4bc7f3383e9',
    expirationDate: '2022-12-04T11:46:52.374Z',
    isConfirmed: false,
    isConfirmedDate: 'None',
    sentEmail: [],
  },
  registrationData: { ip: '::1', userAgent: 'PostmanRuntime/7.29.2' },
};
