import Constants from "expo-constants";

/**
 * API Configuration
 * Loads API base URL from environment variables or Expo config
 * Returns undefined if not configured (allows graceful degradation)
 */
export const getApiBaseUrl = (): string | undefined => {
  return Constants.expoConfig?.extra?.apiBaseUrl || process.env.EXPO_PUBLIC_API_BASE_URL;
};

/**
 * Check if API is configured
 */
export const isApiConfigured = (): boolean => {
  return !!getApiBaseUrl();
};

/**
 * Default API configuration
 */
export const apiConfig = {
  get baseUrl() {
    return getApiBaseUrl();
  },
  timeout: 30000, // 30 seconds
  retryAttempts: 2,
  retryDelay: 1000, // 1 second
};
