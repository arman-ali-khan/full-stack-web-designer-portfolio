import { createClient } from '@supabase/supabase-js';

/**
 * DATABASE SETUP INSTRUCTIONS:
 * 1. Create 'profiles' table with: id (uuid, pk), email (text), created_at (timestamptz).
 * 2. Create 'projects' table with: id (uuid, pk), title (text), description (text), image_url (text), tech_stack (text[]), link (text).
 * 3. Enable RLS on both.
 * 4. Add a public SELECT policy for both tables.
 */

const getSupabaseConfig = () => {
  let url = '';
  let key = '';

  try {
    // Safely check if process.env exists (some browser envs might not have it)
    if (typeof process !== 'undefined' && process.env) {
      url = process.env.SUPABASE_URL || '';
      key = process.env.SUPABASE_ANON_KEY || '';
    }
  } catch (e) {
    console.warn('Process environment not accessible, using fallbacks.');
  }

  // Final validation and fallback to provided defaults if env vars are missing
  const finalUrl = (url && url !== 'undefined') ? url : 'https://lpkikxircgkjbbuzdxxf.supabase.co';
  const finalKey = (key && key !== 'undefined') ? key : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxwa2lreGlyY2dramJidXpkeHhmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcyNTIxODEsImV4cCI6MjA4MjgyODE4MX0.v3y8QB9VrWwCrM-E2SxD9xrYgmarPYZ3SB8pLFw4IIA';

  return { finalUrl, finalKey };
};

const { finalUrl, finalKey } = getSupabaseConfig();

// Create the client. If URL is still empty (highly unlikely with fallbacks), this will throw a clear error.
export const supabase = createClient(finalUrl, finalKey);
