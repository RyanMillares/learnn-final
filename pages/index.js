import Head from 'next/head'
import Welcome from '../components/Welcome'
import Header from '../components/Header'
import { supabase } from '../utils/supabaseClient'
import { Auth } from "@supabase/ui"
import Forums from '../components/Forums'


export default function Home() {
  const { user } = Auth.useUser()
  return (
    
    <>

    <Head>
      <title>Learn'N Home</title>
      <link rel="icon" href="/favicon.ico" />

    </Head>
    {
      user && 
        <Header/>
    }
    
    <main>
      {
        user ? (<div>
          <h1 className = "text-center font-bold">Welcome {(user.email).split("@")[0]}</h1>
         
          
            <Forums 
            user = {(user.email).split("@")[0]}/>
          
          
          <button className = "text-purple-800" onClick = {async () => {
              let {error} = await supabase.auth.signOut()
              if(error) {
                console.log(error)
              }
            }}>
              Logout
            </button>
        </div>) : (
          <div className = "bg-white">
          <Auth supabaseClient = {supabase} socialLayout = "horizontal" socialButtonSize = "xlarge" />
        </div>
        )
      }
    </main>



   






    
    </>
    
  )
}
