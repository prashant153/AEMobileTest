/**
 * API Error Response
 */
export interface ApiErrorResponse {
  message: string;
  code?: string;
  details?: unknown;
}

/**
 * API Error class for handling API errors
 */
export class ApiError extends Error {
  constructor(
    public message: string,
    public status: number,
    public code?: string,
    public details?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }

  static fromResponse(response: Response, data?: ApiErrorResponse): ApiError {
    return new ApiError(
      data?.message || response.statusText || "API request failed",
      response.status,
      data?.code,
      data?.details
    );
  }
}

/**
 * Request options for API calls
 */
export interface ApiRequestOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  headers?: Record<string, string>;
  body?: unknown;
  timeout?: number;
  retryAttempts?: number;
}

/**
 * Response wrapper for successful API calls
 */
export interface ApiResponse<T> {
  data: T;
  status: number;
  headers: Headers;
}
