import { ProvidersEnums } from '../../infrastructure/database/enums/providers.enums';
import { Mongoose } from 'mongoose';
import {
  Last10secDocument,
  Last10secSchema,
} from '../../auth/infrastructure/schemas/last10sec.schemas';
import { NamesCollectionsEnums } from '../../infrastructure/database/enums/names-collections.enums';
import { ConnectionEnums } from '../../infrastructure/database/enums/connection.enums';
import {
  EmailsConfirmCodeDocument,
  EmailsConfirmCodeSchema,
} from '../../mails/infrastructure/schemas/email-confirm-code.schema';
import {
  UsersDocument,
  UsersSchema,
} from '../../users/infrastructure/schemas/user.schema';
import {
  BlackListRefreshJWTDocument,
  BlackListRefreshJWTSchema,
} from '../../auth/infrastructure/schemas/jwt-blacklist.schema';

export const demonsProviders = [
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
    provide: ProvidersEnums.LAST_10SEC_MODEL,
    useFactory: (mongoose: Mongoose) =>
      mongoose.model<Last10secDocument>(
        'Last10sec',
        Last10secSchema,
        NamesCollectionsEnums.LAST_10SEC,
      ),
    inject: [ConnectionEnums.ASYNC_CONNECTION],
  },
  {
    provide: ProvidersEnums.CONFIRM_CODE_MODEL,
    useFactory: (mongoose: Mongoose) =>
      mongoose.model<EmailsConfirmCodeDocument>(
        'EmailsConfirmCodes',
        EmailsConfirmCodeSchema,
        NamesCollectionsEnums.EMAILS_CONFIRM_CODES,
      ),
    inject: [ConnectionEnums.ASYNC_CONNECTION],
  },
  {
    provide: ProvidersEnums.BL_REFRESH_JWT_MODEL,
    useFactory: (mongoose: Mongoose) =>
      mongoose.model<BlackListRefreshJWTDocument>(
        'BlackListRefreshJWT',
        BlackListRefreshJWTSchema,
        NamesCollectionsEnums.BL_REFRESH_JWT,
      ),
    inject: [ConnectionEnums.ASYNC_CONNECTION],
  },
];
