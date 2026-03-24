import { createClient } from '@supabase/supabase-js';

// Only run dotenv in local development
if (process.env.NODE_ENV !== 'production') {
  import('dotenv').then(dotenv => dotenv.config());
}

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("CRITICAL: Missing SUPABASE environment variables.");
}

// Use type assertion to avoid TypeScript errors if they happen to be undefined during build
export const supabase = createClient(supabaseUrl as string, supabaseKey as string);