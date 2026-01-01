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
const SUPABASE_URL = "https://lpkikxircgkjbbuzdxxf.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxwa2lreGlyY2dramJidXpkeHhmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcyNTIxODEsImV4cCI6MjA4MjgyODE4MX0.v3y8QB9VrWwCrM-E2SxD9xrYgmarPYZ3SB8pLFw4IIA";

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);