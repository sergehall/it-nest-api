import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type Last10secDocument = HydratedDocument<Last10sec>;

@Schema()
export class Last10sec {
  @Prop({ required: true })
  ip: string;
  @Prop({ required: true })
  originalUrl: string;
  @Prop({ required: true })
  title: string;
  @Prop({ required: true })
  createdAt: string;
}

export const Last10secSchema = SchemaFactory.createForClass(Last10sec);
