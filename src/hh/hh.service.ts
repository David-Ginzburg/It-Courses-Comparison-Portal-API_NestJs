import { ConfigService } from '@nestjs/config';
import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { API_URL, CLUSTER_FIND_ERROR, SALARY_CLUSTER_ID } from './hh.constants';
import { HhResponse } from './hh.models';
import { firstValueFrom } from 'rxjs';
import { HhData } from 'src/top-page/top-page.model';

@Injectable()
export class HhService {
	private token: string;

	constructor(
		private readonly configService: ConfigService,
		private readonly httpService: HttpService,
	) {
		this.token = this.configService.get('HH_TOKEN') ?? '';
	}

	async getData(text: string) {
		try {
			const { data } = await firstValueFrom(
				this.httpService.get<HhResponse>(API_URL.vacancies, {
					params: {
						text,
						clusters: true,
					},
					headers: {
						'User-Agent': 'OwlTop/1.0 (antonlarichev@gmail.com)',
						Authorization: `Bearer ${this.token}`,
					},
				}),
			);

			return this.parseData(data);
		} catch (e) {
			Logger.error(e);
		}
	}

	private parseData(data: HhResponse): HhData {
		const salaryCluseter = data.clusters.find((cluster) => cluster.id === SALARY_CLUSTER_ID);
		if (!salaryCluseter) {
			throw new Error(CLUSTER_FIND_ERROR);
		}

		const juniorSalary = this.getSalaryFromString(salaryCluseter.items[1].name);
		const middleSalary = this.getSalaryFromString(
			salaryCluseter.items[Math.ceil(salaryCluseter.items.length / 2)].name,
		);
		const seniorSalary = this.getSalaryFromString(
			salaryCluseter.items[salaryCluseter.items.length - 1].name,
		);

		return {
			count: data.found,
			juniorSalary,
			middleSalary,
			seniorSalary,
			updatedAt: new Date(),
		};
	}

	private getSalaryFromString(str: string): number {
		const numberRegExp = /(\d+)/g;
		const res = str.match(numberRegExp);

		if (!res) {
			return 0;
		}

		return Number(res[0]);
	}
}
