import { createClient } from "@supabase/supabase-js";

// Read Supabase configuration from Vite environment variables.
// In development, Vite loads variables prefixed with VITE_ from .env.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

// If variables are missing, output a warning (but don't crash the build)
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "Supabase credentials are missing! Please define VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
