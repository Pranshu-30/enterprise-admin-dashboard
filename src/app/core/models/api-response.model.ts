/**
 * Generic API response wrappers
 */
export interface ApiListResponse<T> {
  data: T[];
  total?: number;
}

export interface ApiErrorResponse {
  message: string;
  statusCode?: number;
  errors?: Record<string, string[]>;
}
