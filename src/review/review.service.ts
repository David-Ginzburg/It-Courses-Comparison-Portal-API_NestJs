import { Injectable, NotFoundException } from '@nestjs/common';
import { ReviewDocument, ReviewModel } from './review.model';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateReviewDto } from './dto/create-review.dto';
import { ProductDocument, ProductModel } from '../product/product.model';
import { PRODUCT_NOT_FOUND_ERROR } from '../product/product.constants';

@Injectable()
export class ReviewService {
	constructor(
		@InjectModel(ReviewModel.name) private readonly reviewModel: Model<ReviewDocument>,
		@InjectModel(ProductModel.name) private readonly productModel: Model<ProductDocument>,
	) {}

	async create(dto: CreateReviewDto): Promise<ReviewDocument> {
		const product = await this.productModel.findById(dto.productId);

		if (!product) {
			throw new NotFoundException(PRODUCT_NOT_FOUND_ERROR);
		}

		return this.reviewModel.create(dto);
	}

	async delete(id: string): Promise<ReviewDocument | null> {
		return this.reviewModel.findByIdAndDelete(id).exec();
	}

	async findByProductId(productId: string): Promise<ReviewDocument[]> {
		return this.reviewModel.find({ productId }).exec();
	}

	async deleteByProductId(productId: string) {
		return this.reviewModel.deleteMany({ productId }).exec();
	}
}
