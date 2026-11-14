import { Session, User } from "@supabase/supabase-js";
import { IntentType } from "@/lib/supabase/types";

// Next action types for navigation
export type NextAction = 
  | "ROLE_INTENT_REQUIRED"    // User needs to select role
  | "COMPLETE_PROFILE"        // User needs to complete profile
  | "ACCOUNT_STATUS"          // Show account status (pending/rejected/suspended)
  | "DASHBOARD";              // Go to dashboard

// Backend auth state from /auth/resolve endpoint
export interface BackendAuthState {
  role: "ATHLETE" | "COACH" | "ACADEMY" | "PARENT" | null; // null if no role assigned
  status: "ACTIVE" | "WAITING_FOR_APPROVAL" | "PENDING_APPROVAL" | "REJECTED" | "SUSPENDED";
  next: NextAction;
  onboarding_state: "COMPLETE" | "PROFILE_INCOMPLETE" | "PENDING" | "IN_PROGRESS";
  allowed_roles: string[];
  user?: UserProfile;
  metadata?: {
    requires_approval?: boolean;
    approval_message?: string;
    missing_fields?: string[];
    rejection_reason?: string;
    suspension_reason?: string;
  };
}

// Request payload for auth/resolve endpoint
export interface AuthResolveRequest {
  role_request?: "ATHLETE" | "COACH" | "ACADEMY" | "PARENT";
}

// User profile from backend
export interface UserProfile {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  dob?: string;
  gender?: string;
  created_at?: string;
  updated_at?: string;
}

// Auth context state
export interface AuthState {
  session: Session | null;
  user: User | null;
  onboardingIntent: IntentType | null;
  backendState: BackendAuthState | null;
  loading: boolean;
  error: string | null;
}

// Auth context actions
export interface AuthContextType {
  // State
  session: Session | null;
  user: User | null;
  onboardingIntent: IntentType | null;
  backendState: BackendAuthState | null;
  loading: boolean;
  error: string | null;

  // Actions
  signInWithOTP: (phoneOrEmail: string, type: "phone" | "email") => Promise<void>;
  verifyOTP: (phoneOrEmail: string, token: string, type: "phone" | "email") => Promise<void>;
  setOnboardingIntent: (intent: IntentType) => Promise<void>;
  resolveAuth: (roleRequest?: "ATHLETE" | "COACH" | "ACADEMY" | "PARENT" | null) => Promise<BackendAuthState | void>;
  signOut: () => Promise<void>;
  clearError: () => void;
}

