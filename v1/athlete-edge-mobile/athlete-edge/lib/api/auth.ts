import { apiClient } from "./client";
import { isApiConfigured } from "./config";
import { BackendAuthState, AuthResolveRequest } from "@/types/auth";

/**
 * Auth API endpoints
 */
export const authApi = {
  /**
   * Resolve authentication with backend
   * POST /auth/resolve
   * 
   * @param accessToken - Supabase access token
   * @param roleRequest - Optional role request (for role assignment after user selects role)
   * @returns Backend auth state including role, status, and next action
   * @throws Error if API is not configured or request fails
   */
  async resolveAuth(
    accessToken: string,
    roleRequest?: "ATHLETE" | "COACH" | "ACADEMY" | "PARENT" | null
  ): Promise<BackendAuthState> {
    console.log("🚀 [AUTH RESOLVE] Starting auth resolution", {
      hasToken: !!accessToken,
      roleRequest,
      timestamp: new Date().toISOString(),
    });

    if (!isApiConfigured()) {
      console.error("❌ [AUTH RESOLVE] API not configured");
      throw new Error("API base URL not configured, cannot resolve authentication");
    }

    // Set auth token for API client (will be used for this and subsequent requests)
    apiClient.setAuthToken(accessToken);

    // Build request body
    const requestBody: AuthResolveRequest = {};
    if (roleRequest) {
      requestBody.role_request = roleRequest;
    }

    console.log("📡 [AUTH RESOLVE] Calling POST /auth/resolve", {
      body: requestBody,
      timestamp: new Date().toISOString(),
    });

    try {
      const response = await apiClient.post<BackendAuthState>(
        "/auth/resolve",
        Object.keys(requestBody).length > 0 ? requestBody : undefined
      );

      console.log("✅ [AUTH RESOLVE] Success", {
        role: response.data.role,
        status: response.data.status,
        next: response.data.next,
        onboarding_state: response.data.onboarding_state,
        allowed_roles: response.data.allowed_roles,
        hasUser: !!response.data.user,
        userEmail: response.data.user?.email,
        timestamp: new Date().toISOString(),
      });

      return response.data;
    } catch (error) {
      console.error("❌ [AUTH RESOLVE] Failed", {
        error: error instanceof Error ? error.message : String(error),
        errorType: error instanceof Error ? error.constructor.name : typeof error,
        timestamp: new Date().toISOString(),
      });
      throw error;
    }
  },
};
