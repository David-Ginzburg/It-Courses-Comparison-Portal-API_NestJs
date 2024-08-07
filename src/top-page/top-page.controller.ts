import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	NotFoundException,
	Param,
	Patch,
	Post,
	UseGuards,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { FindTopPageDto } from './dto/find-top-page.dto';
import { CreateTopPdageDto } from './dto/create-top-page.dto';
import { IdValidationPipe } from 'src/pipes/id-validation.pipe';
import { TopPageService } from './top-page.service';
import {
	ALIAS_PAGE_ALREADY_EXIST,
	NOT_FOUND_ALIAS_TOP_PAGE_ERROR,
	NOT_FOUND_ID_TOP_PAGE_ERROR,
} from './top-page.constants';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { CustomErrorMessageInterceptor } from 'src/decorators/product-title.decorator';
import { HhService } from 'src/hh/hh.service';
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';

@Controller('top-page')
export class TopPageController {
	constructor(
		private readonly topPageService: TopPageService,
		private readonly hhService: HhService,
		private readonly scheduleRegistry: SchedulerRegistry,
	) {}

	@UseGuards(JwtAuthGuard)
	@CustomErrorMessageInterceptor(ALIAS_PAGE_ALREADY_EXIST)
	@UsePipes(new ValidationPipe())
	@Post('create')
	async create(@Body() dto: CreateTopPdageDto) {
		if (dto.hh && dto.hh.updatedAt) {
			dto.hh.updatedAt = new Date(dto.hh.updatedAt);
		}

		return this.topPageService.create(dto);
	}

	@UseGuards(JwtAuthGuard)
	@Get(':id')
	async get(@Param('id', IdValidationPipe) id: string) {
		const page = await this.topPageService.findById(id);

		if (!page) {
			throw new NotFoundException(NOT_FOUND_ID_TOP_PAGE_ERROR);
		}

		return page;
	}

	@Get('byAlias/:alias')
	async getByAlias(@Param('alias') alias: string) {
		const page = await this.topPageService.findByAlias(alias);

		if (!page) {
			throw new NotFoundException(NOT_FOUND_ALIAS_TOP_PAGE_ERROR);
		}

		return page;
	}

	@UseGuards(JwtAuthGuard)
	@Delete(':id')
	async delete(@Param('id', IdValidationPipe) id: string) {
		const deletedPage = await this.topPageService.deleteById(id);

		if (!deletedPage) {
			throw new NotFoundException(NOT_FOUND_ID_TOP_PAGE_ERROR);
		}

		return deletedPage;
	}

	@UseGuards(JwtAuthGuard)
	@Patch(':id')
	async patch(@Param('id', IdValidationPipe) id: string, @Body() dto: CreateTopPdageDto) {
		const updatedPage = await this.topPageService.updateById(id, dto);

		if (!updatedPage) {
			throw new NotFoundException(NOT_FOUND_ID_TOP_PAGE_ERROR);
		}

		return updatedPage;
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('find')
	async find(@Body() dto: FindTopPageDto) {
		return this.topPageService.findByCategory(dto.firstCategory);
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('find-and-aggregate-by-category')
	async findAndAggregateByCategory(@Body() dto: FindTopPageDto) {
		return this.topPageService.findAndAggregateByCategory(dto.firstCategory);
	}

	@Get('textSearch/:text')
	async textSearch(@Param('text') text: string) {
		return this.topPageService.findByText(text);
	}

	@Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
	async updateHhData() {
		const data = await this.topPageService.findForHhUpdate(new Date());
		for (const page of data) {
			const hhData = await this.hhService.getData(page.category);
			page.hh = hhData;
			await this.topPageService.updateById(page._id, page);
		}
	}
}
