import { createClient } from "@supabase/supabase-js";

// Taking from env variables if provided, otherwise falling back to provided the ones in PRD
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://vgelloynfdpdyrhlljap.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZnZWxsb3luZmRwZHlyaGxsamFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA4NTk4OTcsImV4cCI6MjA5NjQzNTg5N30.om81VVac0CIwG4ZsE2pKewFWrzdI6ClCksghtxK5fGI";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
