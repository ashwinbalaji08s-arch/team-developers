import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  !supabaseUrl.includes('your-project-id') &&
  !supabaseAnonKey.includes('your-supabase-anon')
);

// Instantiate real Supabase client if configured, otherwise provide placeholder client
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;

export interface ConnectionStatus {
  isConfigured: boolean;
  statusText: string;
  url: string;
}

export function getDatabaseConnectionStatus(): ConnectionStatus {
  return {
    isConfigured: isSupabaseConfigured,
    statusText: isSupabaseConfigured
      ? 'Connected to Supabase Cloud Instance'
      : 'Using Local Indexed Storage (Configure .env for Supabase Cloud)',
    url: isSupabaseConfigured ? supabaseUrl : 'Local Database Engine',
  };
}
