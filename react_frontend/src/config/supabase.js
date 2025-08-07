import { createClient } from '@supabase/supabase-js'

// Get Supabase configuration from environment variables
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY

// Validate that required environment variables are present
if (!supabaseUrl) {
  throw new Error('Missing REACT_APP_SUPABASE_URL environment variable')
}

if (!supabaseKey) {
  throw new Error('Missing REACT_APP_SUPABASE_KEY environment variable')
}

// PUBLIC_INTERFACE
// Create and export the Supabase client instance
export const supabase = createClient(supabaseUrl, supabaseKey)

// PUBLIC_INTERFACE
/**
 * Get the current authenticated user
 * @returns {Promise} Promise that resolves to user data or null
 */
export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

// PUBLIC_INTERFACE
/**
 * Get the current session
 * @returns {Promise} Promise that resolves to session data or null
 */
export const getCurrentSession = async () => {
  const { data: { session } } = await supabase.auth.getSession()
  return session
}

export default supabase
