import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { ReviewController } from './review.controller';
import { ReviewModel, ReviewSchema } from './review.model';
import { ReviewService } from './review.service';
import { ProductModel, ProductSchema } from 'src/product/product.model';
import { TelegramModule } from 'src/telegram/telegram.module';

@Module({
	controllers: [ReviewController],
	imports: [
		MongooseModule.forFeature([
			{ name: ReviewModel.name, schema: ReviewSchema },
			{ name: ProductModel.name, schema: ProductSchema },
		]),
		TelegramModule,
	],
	providers: [ReviewService],
})
export class ReviewModule {}
