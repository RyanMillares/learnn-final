// utils/supabaseClient.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://vmfmljxwdhlzxqcxzstv.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYzNjM5NjY2NCwiZXhwIjoxOTUxOTcyNjY0fQ.alC_T_97htzjgGG97XQWD-XEeLowjbdJCoQBHeU7E-0'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)