/**
 * Storage Services
 * 
 * Phase 4: Centralized storage services for app data
 * 
 * Usage:
 *   import { IntentStorage, IntentMapper } from '@/lib/storage';
 *   
 *   // Save intent
 *   await IntentStorage.saveIntent('ATHLETE');
 *   
 *   // Load intent
 *   const intent = await IntentStorage.loadIntent();
 *   
 *   // Map UI intent to backend
 *   const backendIntent = IntentMapper.toBackendIntent('player');
 */

export { IntentStorage, IntentStorageError } from "./intentStorage";
export { IntentMapper, type UIIntent, type IntentMapping } from "./intentMapper";
