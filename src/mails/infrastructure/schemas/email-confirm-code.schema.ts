import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type EmailConfimCodeDocument = HydratedDocument<EmailConfimCode>;
@Schema()
export class EmailConfimCode {
  @Prop({ required: true })
  email: string;
  @Prop({ required: true })
  confirmationCode: string;
  @Prop({ required: true })
  createdAt: string;
}

export const EmailsConfimCodeSchema =
  SchemaFactory.createForClass(EmailConfimCode);
