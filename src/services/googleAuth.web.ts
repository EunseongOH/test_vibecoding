import { supabase } from './supabase';

export async function nativeGoogleSignIn() {
  // Web Google Login uses Supabase OAuth redirect
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: typeof window !== 'undefined' ? window.location.origin : undefined,
    },
  });
  
  if (error) throw error;
  return null;
}
