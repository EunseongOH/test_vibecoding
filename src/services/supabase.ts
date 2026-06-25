import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

// Detect if Supabase is properly configured
export const isDemoMode = 
  !supabaseUrl || 
  !supabaseAnonKey || 
  supabaseUrl.includes('your-supabase-project') || 
  supabaseAnonKey === 'your-supabase-anon-key';

if (isDemoMode) {
  console.warn(
    'SWIFIN: Supabase credentials are missing or default. Running in Demo (Local Offline) Mode.'
  );
}

// SSR-safe storage adapter for Supabase Auth in Expo Web
const isSSR = typeof window === 'undefined';

const ssrSafeStorage = {
  getItem: async (key: string) => {
    if (isSSR) return null;
    try {
      return await AsyncStorage.getItem(key);
    } catch {
      return null;
    }
  },
  setItem: async (key: string, value: string) => {
    if (isSSR) return;
    try {
      await AsyncStorage.setItem(key, value);
    } catch {}
  },
  removeItem: async (key: string) => {
    if (isSSR) return;
    try {
      await AsyncStorage.removeItem(key);
    } catch {}
  },
};

export const supabase = createClient(
  isDemoMode ? 'https://placeholder-project.supabase.co' : supabaseUrl,
  isDemoMode ? 'placeholder-anon-key' : supabaseAnonKey,
  {
    auth: {
      storage: ssrSafeStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  }
);
