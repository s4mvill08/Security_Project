import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://eefmkfkntqdlkvlbueqm.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "sb_publishable_GUKg35ZVSKqAtjpv-n_xbgB-LSRHrC";

export const isSupabaseConfigured = Boolean(
  supabaseUrl
  && supabaseAnonKey
  && !supabaseUrl.includes("tu-proyecto")
  && !supabaseAnonKey.includes("tu-clave"),
);
export const supabase = isSupabaseConfigured ? createClient(supabaseUrl, supabaseAnonKey) : null;
