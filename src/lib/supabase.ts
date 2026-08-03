import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Lazy initialization helpers to prevent crash if credentials are not configured yet
let supabaseClient: SupabaseClient | null = null;

export function getSupabaseCredentials() {
  const metaEnv = (import.meta as any).env || {};
  const url = metaEnv.VITE_SUPABASE_URL || (typeof process !== 'undefined' ? process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL : '');
  const key = metaEnv.VITE_SUPABASE_ANON_KEY || (typeof process !== 'undefined' ? process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY : '');
  return { url: url || '', key: key || '' };
}

export function isSupabaseConfigured(): boolean {
  const { url, key } = getSupabaseCredentials();
  return Boolean(url && key && url.trim().length > 0 && key.trim().length > 0);
}

export function getSupabase(): SupabaseClient | null {
  if (supabaseClient) return supabaseClient;
  const { url, key } = getSupabaseCredentials();
  if (!url || !key) {
    return null;
  }
  try {
    supabaseClient = createClient(url, key);
    return supabaseClient;
  } catch (err) {
    console.error('Failed to initialize Supabase client:', err);
    return null;
  }
}
