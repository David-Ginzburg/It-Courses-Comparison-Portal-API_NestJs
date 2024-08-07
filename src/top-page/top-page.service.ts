import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { TopPageModel, TopPageDocument, TopLevelCategory } from './top-page.model';
import { Model } from 'mongoose';
import { CreateTopPdageDto } from './dto/create-top-page.dto';
import { addDays } from 'date-fns';
import { Types } from 'mongoose';

@Injectable()
export class TopPageService {
	constructor(
		@InjectModel(TopPageModel.name) private readonly topPageModel: Model<TopPageDocument>,
	) {}

	async create(dto: CreateTopPdageDto) {
		return this.topPageModel.create(dto);
	}

	async findById(id: string) {
		return this.topPageModel.findById(id).exec();
	}

	async findByAlias(alias: string) {
		return this.topPageModel.findOne({ alias }).exec();
	}

	async findAll() {
		return this.topPageModel.find({}).exec();
	}

	async findByCategory(firstCategory: TopLevelCategory) {
		return this.topPageModel
			.find({ firstCategory }, { alias: 1, secondCategory: 1, title: 1 })
			.exec();
	}

	async findAndAggregateByCategory(firstCategory: TopLevelCategory) {
		return this.topPageModel
			.aggregate([
				{
					$match: {
						firstCategory,
					},
				},
				{
					$group: {
						_id: { secondCategory: '$secondCategory' },
						pages: { $push: { alias: '$alias', title: '$title' } },
					},
				},
			])
			.exec();
	}

	async findByText(text: string) {
		return this.topPageModel.find({ $text: { $search: text, $caseSensitive: false } }).exec();
	}

	async deleteById(id: string) {
		return this.topPageModel.findByIdAndDelete(id).exec();
	}

	async updateById(id: string | Types.ObjectId, dto: CreateTopPdageDto) {
		return this.topPageModel.findByIdAndUpdate(id, dto, { new: true }).exec();
	}

	async findForHhUpdate(date: Date) {
		return this.topPageModel
			.find({
				firstCategory: TopLevelCategory.Courses,
				$or: [
					{ 'hh.updatedAt': { $lt: addDays(date, -1) } },
					{ 'hh.updatedAt': { $exists: false } },
				],
			})
			.exec();
	}
}
