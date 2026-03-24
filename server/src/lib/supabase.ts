import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Synchronously load environment variables ONLY in local development
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("CRITICAL: Missing SUPABASE_URL or SUPABASE_ANON_KEY in environment variables.");
}

// Initialize the client securely
export const supabase = createClient(supabaseUrl as string, supabaseKey as string);