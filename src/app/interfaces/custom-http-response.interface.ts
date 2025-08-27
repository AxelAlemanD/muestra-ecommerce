export interface CustomHttpResponse<T> {
    code: string;
    data: T;
    message_error?: string;
    message?: any;
  }