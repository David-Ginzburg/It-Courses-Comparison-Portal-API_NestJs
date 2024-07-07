import { applyDecorators, SetMetadata, UseInterceptors } from '@nestjs/common';
import { ErrorsInterceptor } from '../interceptors/errors.interceptor';

export function CustomErrorMessageInterceptor(message: string) {
	return applyDecorators(
		SetMetadata('customErrorMessage', message),
		UseInterceptors(ErrorsInterceptor),
	);
}
