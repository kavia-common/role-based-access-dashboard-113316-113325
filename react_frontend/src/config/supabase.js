import { createClient } from "@supabase/supabase-js";

// Reads Supabase config from environment variables (set in .env)
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

// PUBLIC_INTERFACE
// Export the Supabase client as a default export
export default supabase;
