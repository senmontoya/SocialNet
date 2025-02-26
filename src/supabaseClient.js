import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'REDACTED_URL';
const supabaseAnonKey = 'REDACTED_KEY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: window.sessionStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});