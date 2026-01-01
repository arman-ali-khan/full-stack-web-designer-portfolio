
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
 * -- Enable RLS & Add Trigger for automatic profile creation
 * -- (See provided SQL block in response for full implementation)
 */

const supabaseUrl = process.env.SUPABASE_URL || 'https://lpkikxircgkjbbuzdxxf.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxwa2lreGlyY2dramJidXpkeHhmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcyNTIxODEsImV4cCI6MjA4MjgyODE4MX0.v3y8QB9VrWwCrM-E2SxD9xrYgmarPYZ3SB8pLFw4IIA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
