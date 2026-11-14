import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { Session, User, AuthError } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase/client";
import { IntentType } from "@/lib/supabase/types";
import { AuthContextType, BackendAuthState } from "@/types/auth";
import { apiClient, authApi, isApiConfigured } from "@/lib/api";
import { IntentStorage } from "@/lib/storage";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [onboardingIntent, setOnboardingIntentState] = useState<IntentType | null>(null);
  const [backendState, setBackendState] = useState<BackendAuthState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load onboarding intent from storage
  useEffect(() => {
    const loadOnboardingIntent = async () => {
      try {
        const stored = await IntentStorage.loadIntent();
        if (stored) {
          setOnboardingIntentState(stored);
        }
      } catch (err) {
        console.error("Error loading onboarding intent:", err);
      }
    };
    loadOnboardingIntent();
  }, []);

  // Initialize session from Supabase
  useEffect(() => {
    console.log("🔐 [AUTH INIT] Initializing auth context", {
      timestamp: new Date().toISOString(),
    });

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("📥 [AUTH INIT] Initial session retrieved", {
        hasSession: !!session,
        hasAccessToken: !!session?.access_token,
        userId: session?.user?.id,
        userEmail: session?.user?.email,
        timestamp: new Date().toISOString(),
      });

      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("🔄 [AUTH STATE CHANGE]", {
        event,
        hasSession: !!session,
        hasAccessToken: !!session?.access_token,
        userId: session?.user?.id,
        userEmail: session?.user?.email,
        timestamp: new Date().toISOString(),
      });

      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      // If session is restored, call resolveAuth
      if (session?.access_token && isApiConfigured()) {
        console.log("🔑 [AUTH STATE CHANGE] Session has access token, resolving auth", {
          tokenPreview: `${session.access_token.substring(0, 20)}...`,
          timestamp: new Date().toISOString(),
        });

        // Set auth token for API client
        apiClient.setAuthToken(session.access_token);

        // Call resolveAuth with the session token
        try {
          console.log("📞 [AUTH STATE CHANGE] Calling resolveAuth from state change");
          const data = await authApi.resolveAuth(session.access_token);
          console.log("✅ [AUTH STATE CHANGE] Auth resolved successfully", {
            role: data.role,
            status: data.status,
            timestamp: new Date().toISOString(),
          });
          setBackendState(data);
        } catch (err) {
          console.error("❌ [AUTH STATE CHANGE] Error resolving auth after session restore:", err);
        }
      } else {
        // Clear backend state and auth token on sign out
        console.log("🧹 [AUTH STATE CHANGE] Clearing backend state (no session or API not configured)");
        setBackendState(null);
        if (isApiConfigured()) {
          apiClient.clearAuthToken();
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Sign in with OTP (phone or email)
  const signInWithOTP = useCallback(async (phoneOrEmail: string, type: "phone" | "email") => {
    console.log("📤 [OTP SEND] Starting OTP send", {
      type,
      identifier: type === "phone" ? "***" : phoneOrEmail.substring(0, 3) + "***",
      timestamp: new Date().toISOString(),
    });

    try {
      setLoading(true);
      setError(null);

      const { error: authError } = type === "phone"
        ? await supabase.auth.signInWithOtp({
            phone: phoneOrEmail,
            options: {
              shouldCreateUser: true, // Create user if doesn't exist
            },
          })
        : await supabase.auth.signInWithOtp({
            email: phoneOrEmail,
            options: {
              shouldCreateUser: true, // Create user if doesn't exist
            },
          });

      if (authError) {
        console.error("❌ [OTP SEND] Failed", {
          error: authError.message,
          code: authError.status,
          timestamp: new Date().toISOString(),
        });
        throw authError;
      }

      console.log("✅ [OTP SEND] OTP sent successfully", {
        type,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      const error = err as AuthError;
      setError(error.message || "Failed to send OTP");
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Resolve auth with backend (call /auth/resolve)
  const resolveAuth = useCallback(async (
    roleRequest?: "ATHLETE" | "COACH" | "ACADEMY" | "PARENT" | null
  ): Promise<BackendAuthState | void> => {
    console.log("🔍 [RESOLVE AUTH] resolveAuth called", {
      hasSession: !!session,
      hasAccessToken: !!session?.access_token,
      roleRequest,
      timestamp: new Date().toISOString(),
    });

    if (!session?.access_token) {
      console.warn("⚠️ [RESOLVE AUTH] No session token available for auth resolve");
      return;
    }

    if (!isApiConfigured()) {
      console.warn("⚠️ [RESOLVE AUTH] API base URL not configured, skipping auth resolve");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log("🔑 [RESOLVE AUTH] Setting auth token for API client", {
        tokenPreview: `${session.access_token.substring(0, 20)}...`,
        timestamp: new Date().toISOString(),
      });

      // Set auth token for API client
      apiClient.setAuthToken(session.access_token);

      console.log("📞 [RESOLVE AUTH] Calling authApi.resolveAuth with roleRequest:", roleRequest);
      // Call backend API to resolve auth with optional role request
      const data = await authApi.resolveAuth(session.access_token, roleRequest);

      console.log("✅ [RESOLVE AUTH] Auth resolved successfully", {
        role: data.role,
        status: data.status,
        next: data.next,
        onboarding_state: data.onboarding_state,
        timestamp: new Date().toISOString(),
      });

      setBackendState(data);
      return data;
    } catch (err) {
      const error = err as Error;
      console.error("❌ [RESOLVE AUTH] Error resolving auth:", {
        error: error.message,
        errorType: error.constructor.name,
        timestamp: new Date().toISOString(),
      });
      setError(error.message || "Failed to resolve authentication");
      throw error; // Throw to allow calling code to handle
    } finally {
      setLoading(false);
    }
  }, [session]);

  // Verify OTP
  const verifyOTP = useCallback(async (phoneOrEmail: string, token: string, type: "phone" | "email") => {
    console.log("🔐 [OTP VERIFY] Starting OTP verification", {
      type,
      tokenLength: token.length,
      timestamp: new Date().toISOString(),
    });

    try {
      setLoading(true);
      setError(null);

      const { data, error: authError } = type === "phone"
        ? await supabase.auth.verifyOtp({
            phone: phoneOrEmail,
            token,
            type: "sms",
          })
        : await supabase.auth.verifyOtp({
            email: phoneOrEmail,
            token,
            type: "email",
          });

      if (authError) {
        console.error("❌ [OTP VERIFY] Verification failed", {
          error: authError.message,
          code: authError.status,
          timestamp: new Date().toISOString(),
        });
        throw authError;
      }

      if (data.session) {
        console.log("✅ [OTP VERIFY] OTP verified successfully", {
          hasSession: !!data.session,
          hasAccessToken: !!data.session.access_token,
          userId: data.user?.id,
          userEmail: data.user?.email,
          timestamp: new Date().toISOString(),
        });

        setSession(data.session);
        setUser(data.user);

        // Note: Auth resolve will be called by AuthorizationLoaderSlide after OTP verification
        // We just set the session here and let the loader handle the first auth/resolve call
        if (data.session.access_token && isApiConfigured()) {
          console.log("🔑 [OTP VERIFY] Session set, auth token ready for AuthorizationLoaderSlide", {
            tokenPreview: `${data.session.access_token.substring(0, 20)}...`,
            timestamp: new Date().toISOString(),
          });

          // Set auth token for API client (will be used by AuthorizationLoaderSlide)
          apiClient.setAuthToken(data.session.access_token);
        }
      }
    } catch (err) {
      const error = err as AuthError;
      setError(error.message || "Failed to verify OTP");
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Set onboarding intent (store locally)
  const setOnboardingIntent = useCallback(async (intent: IntentType) => {
    try {
      await IntentStorage.saveIntent(intent);
      setOnboardingIntentState(intent);
    } catch (err) {
      console.error("Error saving onboarding intent:", err);
      throw err;
    }
  }, []);

  // Sign out
  const signOut = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Clear local storage
      await IntentStorage.clearIntent();
      setOnboardingIntentState(null);
      setBackendState(null);

      // Clear API client auth token
      apiClient.clearAuthToken();

      // Sign out from Supabase
      const { error: authError } = await supabase.auth.signOut();
      if (authError) {
        throw authError;
      }

      setSession(null);
      setUser(null);
    } catch (err) {
      const error = err as AuthError;
      setError(error.message || "Failed to sign out");
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value: AuthContextType = {
    session,
    user,
    onboardingIntent,
    backendState,
    loading,
    error,
    signInWithOTP,
    verifyOTP,
    setOnboardingIntent,
    resolveAuth,
    signOut,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

