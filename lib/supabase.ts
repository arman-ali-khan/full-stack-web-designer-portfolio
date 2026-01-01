
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

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
