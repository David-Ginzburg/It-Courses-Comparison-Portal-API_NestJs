import { TopLevelCategory } from 'src/top-page/top-page.model';

type routeMapType = Record<TopLevelCategory, string>;

export const CATEGORY_URL: routeMapType = {
	[TopLevelCategory.Courses]: '/courses',
	[TopLevelCategory.Books]: '/books',
	[TopLevelCategory.Services]: '/services',
	[TopLevelCategory.Products]: '/products',
};
