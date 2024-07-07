import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

class ProductCharacteristic {
	@Prop()
	name: string;

	@Prop()
	value: string;
}

export type ProductDocument = HydratedDocument<ProductModel>;

@Schema({ _id: true })
export class ProductModel {
	@Prop()
	image: string;

	@Prop({ unique: true })
	title: string;

	@Prop()
	price: number;

	@Prop()
	oldPrice?: number;

	@Prop()
	credit: number;

	@Prop()
	description: string;

	@Prop()
	advantages: string;

	@Prop()
	disAdvantages: string;

	@Prop({ type: () => [String] })
	categories: string[];

	@Prop({ type: () => [String] })
	tags: string[];

	@Prop({ type: () => [ProductCharacteristic], _id: false })
	characteristics: ProductCharacteristic[];
}

export const ProductSchema = SchemaFactory.createForClass(ProductModel);
