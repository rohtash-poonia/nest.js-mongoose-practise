import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
export type UserDocument = HydratedDocument<User>;
@Schema({ timestamps: true })
export class User {
  @Prop({ required: false, type: String, default: '' })
  username: string;

  @Prop({ required: false, type: String, default: '' })
  firstName: string;

  @Prop({ required: false, type: String, default: '' })
  lastName: string;

  @Prop({ required: false, type: Number, default: 0 })
  age: number;

  @Prop({ required: true, type: String, unique: true })
  email: string;

  @Prop({ required: true, type: String })
  password: string;

  @Prop({ required: false, type: String, default: '' })
  phone: string;

  @Prop({ required: false, type: String, default: 'user' })
  role: string;

  @Prop({ required: false, type: String, default: '' })
  profileImage: string;

  @Prop({ required: false, type: String, default: '' })
  coverImage: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
