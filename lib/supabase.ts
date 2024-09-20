import { createClientComponentClient, createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { createClient } from '@supabase/supabase-js'

export const supabase = createClientComponentClient({

 supabaseUrl :  process.env.SUPABASE_URL!,
  supabaseKey :  process.env.SUPABASE_ANON_KEY!
}
)




export const supabseAdmin = createClient(process.env.SUPABASE_URL!, process.env.SUPABSE_SERVICE_ROLE_KEY!)
