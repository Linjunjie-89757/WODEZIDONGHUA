export interface ApiPage<T> {
  list: T[];
  total: number;
  pageNum?: number;
  pageSize?: number;
}

export interface ApiResponse<T> {
  code?: number | string;
  data: T;
  message?: string;
  success?: boolean;
}
