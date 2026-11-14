import { BackendAuthState } from "@/types/auth";
import { router } from "expo-router";

/**
 * Navigation router for authentication flow
 * Routes user to appropriate screen based on backend auth state
 */
export function navigateFromAuthState(backendState: BackendAuthState): void {
  const { next, status } = backendState;

  console.log("🧭 [NAVIGATION] Navigating based on auth state", {
    next,
    status,
    role: backendState.role,
    timestamp: new Date().toISOString(),
  });

  // Priority 1: Handle status-based routing
  if (status === "SUSPENDED") {
    console.log("🚫 [NAVIGATION] Account suspended, navigating to suspended screen");
    router.replace("/(auth)/suspended");
    return;
  }

  if (status === "REJECTED") {
    console.log("❌ [NAVIGATION] Account rejected, navigating to rejected screen");
    router.replace("/(auth)/rejected");
    return;
  }

  if (status === "PENDING_APPROVAL" || status === "WAITING_FOR_APPROVAL") {
    if (next === "ACCOUNT_STATUS") {
      console.log("⏳ [NAVIGATION] Account pending approval, navigating to account status screen");
      router.replace("/(onboarding)/account-status");
      return;
    }
  }

  // Priority 2: Handle next action routing
  switch (next) {
    case "ROLE_INTENT_REQUIRED":
      console.log("🎯 [NAVIGATION] Role selection required, navigating to role intent selection");
      router.replace("/(onboarding)/role-intent-selection");
      break;

    case "COMPLETE_PROFILE":
      console.log("📝 [NAVIGATION] Profile completion required, navigating to complete profile screen");
      router.replace("/(onboarding)/complete-profile");
      break;

    case "ACCOUNT_STATUS":
      console.log("ℹ️ [NAVIGATION] Account status screen required");
      router.replace("/(onboarding)/account-status");
      break;

    case "DASHBOARD":
      console.log("🏠 [NAVIGATION] Navigating to dashboard");
      router.replace("/(tabs)");
      break;

    default:
      console.warn("⚠️ [NAVIGATION] Unknown next action:", next, "- defaulting to dashboard");
      // Fallback to dashboard
      router.replace("/(tabs)");
  }
}
