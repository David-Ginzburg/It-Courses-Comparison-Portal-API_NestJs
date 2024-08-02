import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { ProductModel } from '../product/product.model';

export type ReviewDocument = HydratedDocument<ReviewModel>;

@Schema({ _id: true, timestamps: true })
export class ReviewModel {
	@Prop()
	name: string;

	@Prop()
	title: string;

	@Prop()
	description: string;

	@Prop()
	rating: number;

	@Prop({ type: Types.ObjectId, ref: ProductModel.name })
	productId: Types.ObjectId;

	@Prop()
	createdAt: Date;

	@Prop()
	updatedAt: Date;
}

export const ReviewSchema = SchemaFactory.createForClass(ReviewModel);
