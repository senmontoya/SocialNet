import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rjinofvjhblfavdhiwjg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqaW5vZnZqaGJsZmF2ZGhpd2pnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAxMDI4MzIsImV4cCI6MjA1NTY3ODgzMn0.7iWsOG87Oe1hg3UvPr1ezQLhIlPmOswNTMg39lE27y0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: window.sessionStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});