import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase env vars')
}

// createBrowserClient from @supabase/ssr automatically handles cookies correctly
// for PKCE flow in the browser, no need for manual cookie configuration
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey)
