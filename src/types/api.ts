export interface ApiResponse<T> {
  status?: string;
  success?: boolean;
  message: string;
  data: T;
}

export interface PaginatedData<T> {
  items: T[];
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
}

export type PaginatedResponse<T> = ApiResponse<PaginatedData<T>>;

export interface QueryParams {
  page?: number;
  limit?: number;
  search?: string;
  [key: string]: any;
}

export interface CursorParams {
  before?: string | number | null;
  after?: string | number | null;
  limit?: number;
}
