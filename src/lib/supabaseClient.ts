import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

const isPlaceholder = !supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('placeholder.supabase.co');

if (isPlaceholder) {
  console.warn(
    'Supabase Configuration Warning: \n' +
    'The app is currently using placeholder credentials. \n' +
    'To fix "Failed to fetch" errors, please go to the "Secrets" panel and set: \n' +
    '1. VITE_SUPABASE_URL (from your Supabase project settings) \n' +
    '2. VITE_SUPABASE_ANON_KEY (from your Supabase project settings)'
  );
}

// Ensure we have a valid-ish URL for the client to prevent immediate initialization errors,
// even if data calls will fail later with "Failed to fetch".
const finalUrl = isPlaceholder ? 'https://placeholder-project.supabase.co' : supabaseUrl;
const finalKey = isPlaceholder ? 'placeholder-key' : supabaseAnonKey;

export const supabase = createClient(finalUrl, finalKey);
