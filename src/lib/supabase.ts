import { createClient } from "@supabase/supabase-js";

// Taking from env variables if provided, otherwise falling back to provided the ones in PRD
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://vehtezupujaljekorqdz.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZlaHRlenVwdWphbGpla29ycWR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA2NDI3NDMsImV4cCI6MjA5NjIxODc0M30.Xht64bf11DbjZifW7ygW_2kSFj4nzd_LhvXVHekq9R8";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
