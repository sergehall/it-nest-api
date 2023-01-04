import { UsersDocument, UsersSchema } from './schemas/user.schema';
import { ProvidersEnums } from '../../infrastructure/database/enums/providers.enums';
import { ConnectionEnums } from '../../infrastructure/database/enums/connection.enums';
import { Mongoose } from 'mongoose';
import { NamesCollectionsEnums } from '../../infrastructure/database/enums/names-collections.enums';
import {
  EmailConfimCodeDocument,
  EmailsConfimCodeSchema,
} from '../../mails/infrastructure/schemas/email-confirm-code.schema';

export const usersProviders = [
  {
    provide: ProvidersEnums.USER_MODEL,
    useFactory: (mongoose: Mongoose) =>
      mongoose.model<UsersDocument>(
        'Users',
        UsersSchema,
        NamesCollectionsEnums.USERS,
      ),
    inject: [ConnectionEnums.ASYNC_CONNECTION],
  },
  {
    provide: ProvidersEnums.CONFIRM_CODE,
    useFactory: (mongoose: Mongoose) =>
      mongoose.model<EmailConfimCodeDocument>(
        'EmailsConfirmCodes',
        EmailsConfimCodeSchema,
        NamesCollectionsEnums.EMAILS_CONFIRM_CODES,
      ),
    inject: [ConnectionEnums.ASYNC_CONNECTION],
  },
];
