// Supabase types for authentication
export type IntentType = "ATHLETE" | "COACH" | "ACADEMY" | "PARENT";

export interface SupabaseConfig {
  url: string;
  anonKey: string;
}

