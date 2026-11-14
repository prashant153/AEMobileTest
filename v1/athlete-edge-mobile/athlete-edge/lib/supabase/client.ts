import { createClient, type SupportedStorage } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";

const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl || process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase environment variables. Please set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY in your app.config.js or .env file."
  );
}

const isServer = typeof window === "undefined";

/** AsyncStorage's web implementation uses `window`; Expo static/SSR runs in Node. */
const authStorage: SupportedStorage = {
  getItem: async (key) => {
    if (isServer) {
      return null;
    }
    return AsyncStorage.getItem(key);
  },
  setItem: async (key, value) => {
    if (isServer) {
      return;
    }
    await AsyncStorage.setItem(key, value);
  },
  removeItem: async (key) => {
    if (isServer) {
      return;
    }
    await AsyncStorage.removeItem(key);
  },
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: authStorage,
    autoRefreshToken: !isServer,
    persistSession: !isServer,
    detectSessionInUrl: false,
  },
});
