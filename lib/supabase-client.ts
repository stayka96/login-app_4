import { createClient } from "@supabase/supabase-js"

// نمط Singleton لعميل Supabase
let supabaseInstance: ReturnType<typeof createClient> | null = null

export const getSupabase = () => {
  if (supabaseInstance) return supabaseInstance

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Missing Supabase environment variables")
    throw new Error("Supabase URL and Anon Key are required. Please check your environment variables.")
  }

  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  })
  return supabaseInstance
}

// دالة للحصول على عميل Supabase من جانب الخادم
export const getServerSupabase = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error("Missing Supabase server environment variables")
    throw new Error("Supabase URL and Service Role Key are required for server operations.")
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
    },
  })
}

// دالة للتحقق من صحة اتصال Supabase
export const checkSupabaseConnection = async () => {
  try {
    const supabase = getSupabase()
    const { data, error } = await supabase.from("users").select("count").limit(1)

    if (error) {
      console.error("Supabase connection error:", error)
      return { connected: false, error: error.message }
    }

    return { connected: true, data }
  } catch (error) {
    console.error("Supabase connection check failed:", error)
    return { connected: false, error: "Failed to connect to Supabase" }
  }
}
