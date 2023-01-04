import { Prop } from '@nestjs/mongoose';

export class EmailConfimCodeEntity {
  @Prop({ required: true })
  email: string;
  @Prop({ required: true })
  confirmationCode: string;
  @Prop({ required: true })
  createdAt: string;
}
