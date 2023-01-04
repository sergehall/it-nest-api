import { ProvidersEnums } from '../../infrastructure/database/enums/providers.enums';
import { ConnectionEnums } from '../../infrastructure/database/enums/connection.enums';
import { Mongoose } from 'mongoose';
import { NamesCollectionsEnums } from '../../infrastructure/database/enums/names-collections.enums';
import {
  EmailConfimCodeDocument,
  EmailsConfimCodeSchema,
} from './schemas/email-confirm-code.schema';

export const mailsProviders = [
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
