import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type JwtRefreshBlacklistDocument = HydratedDocument<JwtRefreshBlacklist>;

@Schema()
export class JwtRefreshBlacklist {
  @Prop({ required: true })
  refreshToken: string;
  @Prop({ required: true })
  expirationDate: string;
}

export const JwtRefreshBlacklistSchema =
  SchemaFactory.createForClass(JwtRefreshBlacklist);
