import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env.local file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
  },
});

console.log('✅ Supabase client initialized with persistence enabled');

// Types pour l'authentification
export interface AuthUser {
  id: string;
  email: string;
  user_metadata?: {
    full_name?: string;
    company?: string;
  };
  created_at: string;
}

export interface AuthResponse {
  user: AuthUser | null;
  session: any | null;
  error: Error | null;
}
