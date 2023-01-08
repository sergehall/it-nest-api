import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type BlackListRefreshJWTDocument = HydratedDocument<BlackListRefreshJWT>;

@Schema()
export class BlackListRefreshJWT {
  @Prop({ required: true })
  refreshToken: string;
  @Prop({ required: true })
  expirationDate: string;
}

export const BlackListRefreshJWTSchema =
  SchemaFactory.createForClass(BlackListRefreshJWT);
