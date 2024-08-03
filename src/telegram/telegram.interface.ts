import { ModuleMetadata } from '@nestjs/common';

export interface ITelegramOptions {
	chatId: string;
	token: string;
}

export interface ITelegramModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
	useFactory: (...args: any[]) => ITelegramOptions | Promise<ITelegramOptions>;
	inject?: any[];
}
