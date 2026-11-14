import { IntentType } from "@/lib/supabase/types";

/**
 * UI Intent types (used in IntentSlide component)
 */
export type UIIntent = "player" | "coach" | "parent" | "admin";

/**
 * Intent mapping configuration
 */
export interface IntentMapping {
  ui: UIIntent;
  backend: IntentType;
  label: string;
  description: string;
}

/**
 * Intent Mapper
 * Maps between UI intent types and backend IntentType
 */
export class IntentMapper {
  /**
   * Mapping from UI intent to backend IntentType
   */
  private static readonly MAPPING: Record<UIIntent, IntentType> = {
    player: "ATHLETE",
    coach: "COACH",
    parent: "PARENT",
    admin: "ACADEMY",
  };

  /**
   * Reverse mapping from backend IntentType to UI intent
   */
  private static readonly REVERSE_MAPPING: Record<IntentType, UIIntent> = {
    ATHLETE: "player",
    COACH: "coach",
    PARENT: "parent",
    ACADEMY: "admin",
  };

  /**
   * Intent metadata for UI display
   */
  private static readonly INTENT_METADATA: Record<UIIntent, Omit<IntentMapping, "ui">> = {
    player: {
      backend: "ATHLETE",
      label: "Track my performance",
      description: "View stats, sessions, progress",
    },
    coach: {
      backend: "COACH",
      label: "Coach & manage athletes",
      description: "Plan sessions and monitor players",
    },
    parent: {
      backend: "PARENT",
      label: "Follow my child's journey",
      description: "Attendance and performance insights",
    },
    admin: {
      backend: "ACADEMY",
      label: "Manage an academy",
      description: "Coaches, batches, analytics",
    },
  };

  /**
   * Convert UI intent to backend IntentType
   */
  static toBackendIntent(uiIntent: UIIntent): IntentType {
    const backendIntent = this.MAPPING[uiIntent];
    if (!backendIntent) {
      throw new Error(`Invalid UI intent: ${uiIntent}`);
    }
    return backendIntent;
  }

  /**
   * Convert backend IntentType to UI intent
   */
  static toUIIntent(backendIntent: IntentType): UIIntent {
    const uiIntent = this.REVERSE_MAPPING[backendIntent];
    if (!uiIntent) {
      throw new Error(`Invalid backend intent: ${backendIntent}`);
    }
    return uiIntent;
  }

  /**
   * Get all intent mappings
   */
  static getAllMappings(): IntentMapping[] {
    return Object.entries(this.INTENT_METADATA).map(([ui, metadata]) => ({
      ui: ui as UIIntent,
      ...metadata,
    }));
  }

  /**
   * Get intent metadata for UI display
   */
  static getIntentMetadata(uiIntent: UIIntent): Omit<IntentMapping, "ui"> {
    const metadata = this.INTENT_METADATA[uiIntent];
    if (!metadata) {
      throw new Error(`Invalid UI intent: ${uiIntent}`);
    }
    return metadata;
  }

  /**
   * Check if UI intent is valid
   */
  static isValidUIIntent(intent: string): intent is UIIntent {
    return intent in this.MAPPING;
  }

  /**
   * Check if backend intent is valid
   */
  static isValidBackendIntent(intent: string): intent is IntentType {
    return intent in this.REVERSE_MAPPING;
  }
}
