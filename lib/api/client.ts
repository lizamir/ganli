import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Without these the app runs in demo mode on mock data. The portfolio build forces demo mode
// (NEXT_PUBLIC_GANLI_DEMO=1) so public visitors never reach the real database.
export const supabaseConfigured = Boolean(url && anonKey) && process.env.NEXT_PUBLIC_GANLI_DEMO !== "1";

export const supabase: SupabaseClient | null = supabaseConfigured ? createClient(url!, anonKey!) : null;
