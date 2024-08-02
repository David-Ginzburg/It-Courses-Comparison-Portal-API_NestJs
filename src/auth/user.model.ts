import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<UserModel>;
@Schema({ _id: true, timestamps: true })
export class UserModel {
	@Prop({ unique: true })
	email: string;

	@Prop()
	passwordHash: string;

	@Prop()
	createdAt: Date;

	@Prop()
	updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(UserModel);
