import { apiConfig } from "./config";
import { ApiError, ApiRequestOptions, ApiResponse } from "./types";

/**
 * Base API Client
 * Handles all HTTP requests with authentication, error handling, and retry logic
 */
export class ApiClient {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;

  constructor(baseUrl?: string) {
    const configuredUrl = baseUrl || apiConfig.baseUrl;
    if (!configuredUrl) {
      throw new Error(
        "API base URL not configured. Please set EXPO_PUBLIC_API_BASE_URL in your app.config.js or .env file."
      );
    }
    this.baseUrl = configuredUrl;
    this.defaultHeaders = {
      "Content-Type": "application/json",
    };
  }

  /**
   * Set authorization token for subsequent requests
   */
  setAuthToken(token: string | null): void {
    if (token) {
      this.defaultHeaders["Authorization"] = `Bearer ${token}`;
      console.log("🔑 [AUTH TOKEN SET]", {
        tokenPreview: `${token.substring(0, 20)}...`,
        tokenLength: token.length,
        timestamp: new Date().toISOString(),
      });
    } else {
      delete this.defaultHeaders["Authorization"];
      console.log("🔓 [AUTH TOKEN CLEARED]", {
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * Clear authorization token
   */
  clearAuthToken(): void {
    delete this.defaultHeaders["Authorization"];
  }

  /**
   * Make an API request with retry logic and error handling
   */
  async request<T>(
    endpoint: string,
    options: ApiRequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const {
      method = "GET",
      headers = {},
      body,
      timeout = apiConfig.timeout,
      retryAttempts = apiConfig.retryAttempts,
    } = options;

    const url = `${this.baseUrl}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;
    const requestHeaders = {
      ...this.defaultHeaders,
      ...headers,
    };

    // Log request details
    console.log("🔵 [API REQUEST]", {
      method,
      url,
      endpoint,
      hasAuth: !!requestHeaders["Authorization"],
      authTokenPreview: requestHeaders["Authorization"]
        ? `${requestHeaders["Authorization"].substring(0, 20)}...`
        : "none",
      body: body ? JSON.stringify(body).substring(0, 100) : "none",
      timestamp: new Date().toISOString(),
    });

    const requestOptions: RequestInit = {
      method,
      headers: requestHeaders,
      ...(body && { body: JSON.stringify(body) }),
    };

    let lastError: Error | null = null;
    const startTime = Date.now();

    // Retry logic
    for (let attempt = 0; attempt <= retryAttempts; attempt++) {
      try {
        if (attempt > 0) {
          console.log(`🔄 [API RETRY] Attempt ${attempt + 1}/${retryAttempts + 1} for ${endpoint}`);
        }

        const response = await this.fetchWithTimeout(url, requestOptions, timeout);
        const duration = Date.now() - startTime;

        // Log response details
        console.log("🟢 [API RESPONSE]", {
          method,
          endpoint,
          status: response.status,
          statusText: response.statusText,
          duration: `${duration}ms`,
          attempt: attempt + 1,
          timestamp: new Date().toISOString(),
        });

        // Handle non-OK responses
        if (!response.ok) {
          let errorData: unknown;
          try {
            errorData = await response.json();
            console.log("🔴 [API ERROR RESPONSE]", {
              endpoint,
              status: response.status,
              error: errorData,
            });
          } catch {
            // If response is not JSON, use status text
            errorData = { message: response.statusText };
            console.log("🔴 [API ERROR RESPONSE]", {
              endpoint,
              status: response.status,
              error: response.statusText,
            });
          }

          throw ApiError.fromResponse(
            response,
            errorData as { message: string; code?: string; details?: unknown }
          );
        }

        // Parse response
        let data: T;
        const contentType = response.headers.get("content-type");
        if (contentType?.includes("application/json")) {
          data = await response.json();
          console.log("✅ [API SUCCESS]", {
            endpoint,
            status: response.status,
            dataPreview: JSON.stringify(data).substring(0, 200),
            timestamp: new Date().toISOString(),
          });
        } else {
          // For non-JSON responses, return empty object
          data = {} as T;
          console.log("✅ [API SUCCESS]", {
            endpoint,
            status: response.status,
            contentType,
            timestamp: new Date().toISOString(),
          });
        }

        return {
          data,
          status: response.status,
          headers: response.headers,
        };
      } catch (error) {
        lastError = error as Error;
        const duration = Date.now() - startTime;

        console.log("❌ [API ERROR]", {
          endpoint,
          attempt: attempt + 1,
          error: error instanceof Error ? error.message : String(error),
          errorType: error instanceof Error ? error.constructor.name : typeof error,
          duration: `${duration}ms`,
          timestamp: new Date().toISOString(),
        });

        // Don't retry on client errors (4xx) except for network errors
        if (error instanceof ApiError && error.status >= 400 && error.status < 500) {
          throw error;
        }

        // Retry on server errors (5xx) or network errors
        if (attempt < retryAttempts) {
          // Exponential backoff
          const delay = apiConfig.retryDelay * Math.pow(2, attempt);
          console.log(`⏳ [API RETRY DELAY] Waiting ${delay}ms before retry...`);
          await this.sleep(delay);
          continue;
        }

        // If all retries failed, throw the last error
        throw lastError;
      }
    }

    throw lastError || new Error("Request failed");
  }

  /**
   * Fetch with timeout
   */
  private async fetchWithTimeout(
    url: string,
    options: RequestInit,
    timeout: number
  ): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === "AbortError") {
        throw new ApiError("Request timeout", 408, "TIMEOUT");
      }
      throw error;
    }
  }

  /**
   * Sleep utility for retry delays
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, options?: Omit<ApiRequestOptions, "method" | "body">): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: "GET" });
  }

  /**
   * POST request
   */
  async post<T>(
    endpoint: string,
    body?: unknown,
    options?: Omit<ApiRequestOptions, "method" | "body">
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: "POST", body });
  }

  /**
   * PUT request
   */
  async put<T>(
    endpoint: string,
    body?: unknown,
    options?: Omit<ApiRequestOptions, "method" | "body">
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: "PUT", body });
  }

  /**
   * PATCH request
   */
  async patch<T>(
    endpoint: string,
    body?: unknown,
    options?: Omit<ApiRequestOptions, "method" | "body">
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: "PATCH", body });
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string, options?: Omit<ApiRequestOptions, "method" | "body">): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: "DELETE" });
  }
}

/**
 * Singleton API client instance
 * Lazily initialized to handle cases where API URL might not be configured
 */
let _apiClient: ApiClient | null = null;

export const apiClient: ApiClient = new Proxy({} as ApiClient, {
  get(_target, prop) {
    if (!_apiClient) {
      const baseUrl = apiConfig.baseUrl;
      if (!baseUrl) {
        throw new Error(
          "API base URL not configured. Please set EXPO_PUBLIC_API_BASE_URL in your app.config.js or .env file."
        );
      }
      _apiClient = new ApiClient(baseUrl);
    }
    const value = _apiClient[prop as keyof ApiClient];
    return typeof value === "function" ? value.bind(_apiClient) : value;
  },
});
