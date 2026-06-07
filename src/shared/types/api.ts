export interface PageQuery {
  pageNum: number;
  pageSize: number;
}

export interface PageResult<T> {
  list: T[];
  total: number;
}

export interface BackendResult<T> {
  code?: number | string;
  data: T;
  message?: string;
  success?: boolean;
}
