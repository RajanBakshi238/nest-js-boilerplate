import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class User {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: Date, required: true })
  dob: Date;

  @Prop({required: true})
  role: string        // user, vendor, admin
}

export const UserSchema = SchemaFactory.createForClass(User);
