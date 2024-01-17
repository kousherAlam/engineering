export interface ApiResponse<T> {
  data: T;
  statusCode: number;
  message: string;
  ok: boolean;
}
