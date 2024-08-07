import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TopPageModule } from './top-page/top-page.module';
import { ProductModule } from './product/product.module';
import { ReviewModule } from './review/review.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { FilesModule } from './files/files.module';
import { SitemapModule } from './sitemap/sitemap.module';
import { TelegramModule } from './telegram/telegram.module';
import * as dotenv from 'dotenv';
import { getTelegramConfig } from './configs/telegram.config';
import { HhModule } from './hh/hh.module';
dotenv.config();

@Module({
	imports: [
		ConfigModule.forRoot(),
		MongooseModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: async (configService: ConfigService) => {
				const uri = configService.get<string>(
					process.env.NODE_ENV === 'docker' ? 'MONGO_DOCKER_URI' : 'MONGO_LOCAL_URI',
				);

				return {
					uri,
					user: configService.get<string>('MONGO_INITDB_ROOT_USERNAME'),
					pass: configService.get<string>('MONGO_INITDB_ROOT_PASSWORD'),
					authSource: 'admin',
				};
			},
			inject: [ConfigService],
		}),
		AuthModule,
		TopPageModule,
		ProductModule,
		ReviewModule,
		FilesModule,
		SitemapModule,
		TelegramModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: getTelegramConfig,
		}),
		HhModule,
	],
})
export class AppModule {}
