export interface ApiError {
	detail: string;
	code?: string;
}

export interface BasePage {
	size: number;
	number: number;
	totalElements: number;
	totalPages: number;
}

export interface PagedResponse<T> {
	content: T[];
	page: BasePage;
}
