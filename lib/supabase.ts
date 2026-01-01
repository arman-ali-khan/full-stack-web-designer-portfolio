import { createClient } from '@supabase/supabase-js';

/**
 * UPDATED SQL SCHEMA:
 * 
 * CREATE TABLE profiles (
 *   id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
 *   email TEXT UNIQUE,
 *   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
 * );
 * 
 * -- Ensure RLS is enabled and policies allow initial check
 * ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
 * CREATE POLICY "Public read profiles" ON profiles FOR SELECT USING (true);
 */

const getSupabaseConfig = () => {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;

  // Fallback to hardcoded values if env vars are missing or are literally "undefined" strings
  const finalUrl = (url && url !== 'undefined') ? url : 'https://lpkikxircgkjbbuzdxxf.supabase.co';
  const finalKey = (key && key !== 'undefined') ? key : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxwa2lreGlyY2dramJidXpkeHhmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcyNTIxODEsImV4cCI6MjA4MjgyODE4MX0.v3y8QB9VrWwCrM-E2SxD9xrYgmarPYZ3SB8pLFw4IIA';

  return { finalUrl, finalKey };
};

const { finalUrl, finalKey } = getSupabaseConfig();

export const supabase = createClient(finalUrl, finalKey);
