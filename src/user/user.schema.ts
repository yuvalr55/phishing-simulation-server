import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserAttackedDocument = UserAttacked & Document;

@Schema({ timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } })
export class UserAttacked {
  /** Email address of the sender. */
  @Prop({ required: true })
  source: string;

  /** Email address of the recipient. */
  @Prop({ required: true })
  target: string;

  /** Current status of the phishing attempt. */
  @Prop({ required: true, default: 'pending' })
  status: string;
}

export const UserAttackedSchema = SchemaFactory.createForClass(UserAttacked);

export type UserDocument = User & Document;

@Schema({ timestamps: { createdAt: 'createdAt' } })
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  isAdmin: boolean;
}
