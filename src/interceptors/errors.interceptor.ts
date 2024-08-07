import {
	CallHandler,
	ExecutionContext,
	Injectable,
	NestInterceptor,
	ConflictException,
	InternalServerErrorException,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MongoError } from 'mongodb';
import { Reflector } from '@nestjs/core';

@Injectable()
export class ErrorsInterceptor implements NestInterceptor {
	constructor(private readonly reflector: Reflector) {}

	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		const customErrorMessage = this.reflector.get<string>(
			'customErrorMessage',
			context.getHandler(),
		);

		return next.handle().pipe(
			catchError((error) => {
				if (error instanceof MongoError && error.code === 11000) {
					return throwError(
						() =>
							new ConflictException(
								customErrorMessage ||
									'Не удалось создать сущность. Такая сущность уже существует',
							),
					);
				}
				console.log(error);
				return throwError(() => new InternalServerErrorException('Internal server error'));
			}),
		);
	}
}
