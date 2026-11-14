/**
 * Backend API Client
 * 
 * Phase 3: Centralized API client for all backend API calls
 * 
 * Usage:
 *   import { apiClient, authApi } from '@/lib/api';
 *   
 *   // Set auth token once after login
 *   apiClient.setAuthToken(session.access_token);
 *   
 *   // Use auth API methods
 *   const backendState = await authApi.resolveAuth(session.access_token);
 */

export { apiClient, ApiClient } from "./client";
export { authApi } from "./auth";
export { apiConfig, getApiBaseUrl, isApiConfigured } from "./config";
export { ApiError, ApiRequestOptions, ApiResponse } from "./types";
