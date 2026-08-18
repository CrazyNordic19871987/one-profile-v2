import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://wrvzdonjvislrkeltjer.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indydnpkb25qdmlzbHJrZWx0amVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY5Njk2OTksImV4cCI6MjEwMjU0NTY5OX0.tXTbVJvpg4CJdLoekwUrucrzUJyTdHX6lHgTbmbXE3g'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
