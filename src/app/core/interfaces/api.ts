export interface Pagination {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  message: string;
  pagination?: Pagination;
  data: T;
  status?: number;
}
