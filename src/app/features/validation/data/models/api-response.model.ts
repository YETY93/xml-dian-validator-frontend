export interface ApiResponse<T> {
  success: boolean;
  status: 'SUCCESS' | 'ERROR';
  code: string;
  action: string;
  lastAction: string;
  data: T;
}
