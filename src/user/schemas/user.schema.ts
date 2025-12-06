
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Role } from '../user.types';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({required: true})
  fname: string;

 
  lname: string;

  @Prop({unique: true, sparse: true})
  email: string;

  @Prop({unique: true, sparse: true})
  mobileNumber: string

  @Prop({required: true})
  password: string;

  @Prop({default: Role.Player})
  role:string;

  @Prop({default: false})
  isEmailVerified: boolean;

    @Prop({default: false})
  isMobileVerified: boolean;

  @Prop()
  emailVerificationOtp: string;

    @Prop()
  mobileVerificationOtp: string;

  @Prop()
  otpExpiresAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
