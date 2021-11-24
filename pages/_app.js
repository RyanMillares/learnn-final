import 'tailwindcss/tailwind.css'
import { supabase } from '../utils/supabaseClient'
import { Auth } from "@supabase/ui"
import "./styles.css"
import "./loading.css"


function MyApp({ Component, pageProps }) {
  
  return (
  <Auth.UserContextProvider supabaseClient = {supabase}>
    <Component {...pageProps} />
  </Auth.UserContextProvider>
  )
}

export default MyApp
