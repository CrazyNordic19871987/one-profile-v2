import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://wrvzdonjvislrkeltjer.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndydmZkb25qdmlzbHJrZWx0amVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjQwMTk2MDAsImV4cCI6MjAzOTU5NTYwMH0.placeholder'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
