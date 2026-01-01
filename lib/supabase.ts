import { createClient } from '@supabase/supabase-js';

/**
 * DATABASE SETUP INSTRUCTIONS:
 * 1. Create 'profiles' table with: id (uuid, pk), email (text), created_at (timestamptz).
 * 2. Create 'projects' table with: id (uuid, pk), title (text), description (text), image_url (text), tech_stack (text[]), link (text).
 * 3. Enable RLS on both.
 * 4. Add a public SELECT policy for both tables.
 */

// We use hardcoded fallback values for the environment to ensure the app bootstraps.
// In a production environment, these should be handled by your CI/CD.
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY; 

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);