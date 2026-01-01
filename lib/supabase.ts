import { createClient } from '@supabase/supabase-js';

/**
 * DATABASE SETUP INSTRUCTIONS:
 * 1. Create 'profiles' table with: id (uuid, pk), email (text), created_at (timestamptz).
 * 2. Create 'projects' table with: id (uuid, pk), title (text), description (text), image_url (text), tech_stack (text[]), link (text).
 * 3. Enable RLS on both.
 * 4. Add a public SELECT policy for both tables.
 */

// Helper to safely retrieve environment variables from import.meta.env or process.env
const getEnvVar = (key: string): string => {
  try {
    // Check import.meta.env (Vite/ESM)
    if (typeof import.meta !== 'undefined' && (import.meta as any).env) {
      return (import.meta as any).env[key] || '';
    }
    // Check process.env (Node/Webpack)
    if (typeof process !== 'undefined' && process.env) {
      return process.env[key] || '';
    }
  } catch (e) {
    console.warn(`Error accessing environment variable ${key}:`, e);
  }
  return '';
};

const SUPABASE_URL = getEnvVar('VITE_SUPABASE_URL');
const SUPABASE_KEY = getEnvVar('VITE_SUPABASE_ANON_KEY');

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.warn(
    "Supabase configuration is missing! The application will not be able to sync data.\n" +
    "Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in your environment."
  );
}

// Create client - note: createClient handles empty strings by throwing descriptive errors 
// only when calls are made, allowing the initial module load to succeed.
export const supabase = createClient(
  SUPABASE_URL || 'https://placeholder-url.supabase.co', 
  SUPABASE_KEY || 'placeholder-key'
);