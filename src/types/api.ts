export interface ApiResponse<T> {
  status: string;
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
