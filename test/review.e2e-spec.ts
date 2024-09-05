import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { CreateReviewDto } from '../src/review/dto/create-review.dto';
import { Types, disconnect } from 'mongoose';
import { ReviewDocument } from 'src/review/review.model';
import { REVIEW_NOT_FOUND } from '../src/review/review.constants';
import { AuthDto } from 'src/auth/dto/auth.dto';
import { CreateProductDto } from 'src/product/dto/create-product.dto';

const loginDto: AuthDto = {
	password: 'admin',
	login: 'admin@admin.com',
};

const productDto: CreateProductDto = {
	image: '1.png',
	title: 'Мой продукт 12345',
	price: 100,
	oldPrice: 120,
	credit: 10,
	description: 'Описание продукта',
	advantages: 'Преимущества продукта',
	disAdvantages: 'Недостатки продукта',
	categories: ['тест'],
	tags: ['тег1'],
	characteristics: [
		{
			name: 'Характеристика 1',
			value: '1',
		},
		{
			name: 'Характеристика 2',
			value: '2',
		},
	],
};

describe('AppController (e2e)', () => {
	let app: INestApplication;
	let createdId: Types.ObjectId;
	let token: string;
	let reviewTestDto: CreateReviewDto;

	beforeAll(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();

		const { body: loginBody } = await request(app.getHttpServer())
			.post('/auth/login')
			.send(loginDto);
		token = loginBody.access_token;

		const { body: productBody } = await request(app.getHttpServer())
			.post('/product/create')
			.set('Authorization', 'Bearer ' + token)
			.send(productDto);
		console.log(productBody);
		reviewTestDto = {
			name: 'Тест',
			title: 'Заголовок',
			description: 'Описание тестовое',
			rating: 5,
			productId: new Types.ObjectId(productBody._id) as unknown as string,
		};

		console.log(reviewTestDto);
	});

	it('/review/create (POST) - success', async () => {
		return request(app.getHttpServer())
			.post('/review/create')
			.set('Authorization', 'Bearer ' + token)
			.send(reviewTestDto)
			.expect(201)
			.then((res: request.Response) => {
				const { _id } = res.body as ReviewDocument;
				createdId = new Types.ObjectId(_id);
				expect(createdId).toBeDefined();
			});
	});

	it('/review/create (POST) - fail', () => {
		return request(app.getHttpServer())
			.post('/review/create')
			.set('Authorization', 'Bearer ' + token)
			.send({ ...reviewTestDto, rating: 0 })
			.expect(400);
	});

	it('/review/byProduct/:productId (GET) - success', async () => {
		return request(app.getHttpServer())
			.get('/review/byProduct/' + reviewTestDto.productId)
			.set('Authorization', 'Bearer ' + token)
			.expect(200)
			.then(({ body }: request.Response) => {
				expect(body.length).toBe(1);
			});
	});

	it('/review/byProduct/:productId (GET) - fail', async () => {
		return request(app.getHttpServer())
			.get('/review/byProduct/' + new Types.ObjectId().toHexString())
			.set('Authorization', 'Bearer ' + token)
			.expect(200)
			.then(({ body }: request.Response) => {
				expect(body.length).toBe(0);
			});
	});

	it('/review/:id (DELETE) - success', () => {
		return request(app.getHttpServer())
			.delete('/review/' + createdId)
			.set('Authorization', 'Bearer ' + token)
			.expect(200);
	});

	it('/review/:id (DELETE) - fail', async () => {
		return request(app.getHttpServer())
			.delete('/review/' + new Types.ObjectId().toHexString())
			.set('Authorization', 'Bearer ' + token)
			.expect(404)
			.then(({ body }: request.Response) => {
				expect(body.statusCode).toBe(404);
				expect(body.message).toBe(REVIEW_NOT_FOUND);
			});
	});

	afterAll(async () => {
		await request(app.getHttpServer())
			.delete('/product/' + reviewTestDto.productId)
			.set('Authorization', 'Bearer ' + token);

		disconnect();
	});
});
