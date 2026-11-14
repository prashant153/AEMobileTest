import AsyncStorage from "@react-native-async-storage/async-storage";
import { IntentType } from "@/lib/supabase/types";

/**
 * Storage keys for intent data
 */
const STORAGE_KEYS = {
  ONBOARDING_INTENT: "@athlete_edge:onboarding_intent",
  INTENT_SELECTED_AT: "@athlete_edge:intent_selected_at",
  INTENT_VERSION: "@athlete_edge:intent_version",
} as const;

/**
 * Current version of intent storage format
 * Increment this when the storage format changes
 */
const INTENT_STORAGE_VERSION = 1;

/**
 * Intent storage error
 */
export class IntentStorageError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = "IntentStorageError";
  }
}

/**
 * Intent Storage Service
 * 
 * Phase 4: Centralized intent storage with persistence, validation, and migration support
 */
export class IntentStorage {
  /**
   * Save onboarding intent
   */
  static async saveIntent(intent: IntentType): Promise<void> {
    try {
      // Validate intent
      if (!this.isValidIntent(intent)) {
        throw new IntentStorageError(`Invalid intent: ${intent}`, "INVALID_INTENT");
      }

      // Save intent with timestamp and version
      await Promise.all([
        AsyncStorage.setItem(STORAGE_KEYS.ONBOARDING_INTENT, intent),
        AsyncStorage.setItem(STORAGE_KEYS.INTENT_SELECTED_AT, new Date().toISOString()),
        AsyncStorage.setItem(STORAGE_KEYS.INTENT_VERSION, String(INTENT_STORAGE_VERSION)),
      ]);
    } catch (error) {
      if (error instanceof IntentStorageError) {
        throw error;
      }
      throw new IntentStorageError(
        `Failed to save intent: ${error instanceof Error ? error.message : "Unknown error"}`,
        "SAVE_ERROR"
      );
    }
  }

  /**
   * Load onboarding intent
   */
  static async loadIntent(): Promise<IntentType | null> {
    try {
      const [intent, version] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.ONBOARDING_INTENT),
        AsyncStorage.getItem(STORAGE_KEYS.INTENT_VERSION),
      ]);

      if (!intent) {
        return null;
      }

      // Validate stored intent
      if (!this.isValidIntent(intent as IntentType)) {
        console.warn("Invalid intent found in storage, clearing it");
        await this.clearIntent();
        return null;
      }

      // Handle version migration if needed
      const storedVersion = version ? parseInt(version, 10) : 0;
      if (storedVersion < INTENT_STORAGE_VERSION) {
        // Future: Add migration logic here if storage format changes
        await AsyncStorage.setItem(STORAGE_KEYS.INTENT_VERSION, String(INTENT_STORAGE_VERSION));
      }

      return intent as IntentType;
    } catch (error) {
      console.error("Error loading intent:", error);
      throw new IntentStorageError(
        `Failed to load intent: ${error instanceof Error ? error.message : "Unknown error"}`,
        "LOAD_ERROR"
      );
    }
  }

  /**
   * Get intent metadata (when it was selected)
   */
  static async getIntentMetadata(): Promise<{ selectedAt: Date | null; version: number }> {
    try {
      const [selectedAt, version] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.INTENT_SELECTED_AT),
        AsyncStorage.getItem(STORAGE_KEYS.INTENT_VERSION),
      ]);

      return {
        selectedAt: selectedAt ? new Date(selectedAt) : null,
        version: version ? parseInt(version, 10) : 0,
      };
    } catch (error) {
      console.error("Error loading intent metadata:", error);
      return { selectedAt: null, version: 0 };
    }
  }

  /**
   * Clear onboarding intent
   */
  static async clearIntent(): Promise<void> {
    try {
      await Promise.all([
        AsyncStorage.removeItem(STORAGE_KEYS.ONBOARDING_INTENT),
        AsyncStorage.removeItem(STORAGE_KEYS.INTENT_SELECTED_AT),
        AsyncStorage.removeItem(STORAGE_KEYS.INTENT_VERSION),
      ]);
    } catch (error) {
      console.error("Error clearing intent:", error);
      throw new IntentStorageError(
        `Failed to clear intent: ${error instanceof Error ? error.message : "Unknown error"}`,
        "CLEAR_ERROR"
      );
    }
  }

  /**
   * Check if intent is stored
   */
  static async hasIntent(): Promise<boolean> {
    try {
      const intent = await AsyncStorage.getItem(STORAGE_KEYS.ONBOARDING_INTENT);
      return intent !== null && this.isValidIntent(intent as IntentType);
    } catch (error) {
      console.error("Error checking intent:", error);
      return false;
    }
  }

  /**
   * Validate intent type
   */
  private static isValidIntent(intent: string): intent is IntentType {
    return ["ATHLETE", "COACH", "ACADEMY", "PARENT"].includes(intent);
  }
}
