import { Test, TestingModule } from '@nestjs/testing';
import { ReviewService } from './review.service';
import { getModelToken } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { ReviewModel } from './review.model';
import { ProductModel } from '../product/product.model';

describe('ReviewService', () => {
	let service: ReviewService;

	const exec = { exec: jest.fn() };
	const reviewRepositoryFactory = () => ({
		find: () => exec,
	});

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				ReviewService,
				{ useFactory: reviewRepositoryFactory, provide: getModelToken(ReviewModel.name) },
				{ useFactory: reviewRepositoryFactory, provide: getModelToken(ProductModel.name) },
			],
		}).compile();

		service = module.get<ReviewService>(ReviewService);
	});

	it('findByProductId - success', async () => {
		const id = new Types.ObjectId().toHexString();

		reviewRepositoryFactory()
			.find()
			.exec.mockResolvedValueOnce([{ productId: id }]);

		const res = await service.findByProductId(id);
		expect(res[0].productId).toBe(id);
	});
});
