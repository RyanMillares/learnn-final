import Head from 'next/head'
import Header from '../components/Header'
import { supabase } from '../utils/supabaseClient'
import { Auth } from "@supabase/ui"

import React, { useState } from "react";


export default function Home() {
  const [selectedImage, setSelectedImage] = useState(null);
  const { user } = Auth.useUser()
  const addTestUser = async () => {
    let { user, error } = await supabase.auth.signUp({
      email: 'rmillares@chapman.edu',
      password: 'swedrfgyunur6itfgyo8h'
    })
      if(error) {
        console.log(error)
      }
      else {
        console.log("user added")
      }
  }
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
    <h1 className = "text-center font-bold text-4xl">
      If guest: display list of potential features and give link to a login page. If user, display recent activity of some sort (dashboard)
      Move all this stuff somewhere else 
   
    </h1>
    
       { //            <Forums user = {(user.email).split("@")[0]}/>

        user ? (<div>
          <h1 className = "text-center font-bold">Welcome {(user.email).split("@")[0]}</h1>
         
          
          <button className = "text-purple-800" onClick = {async () => {
              let {error} = await supabase.auth.signOut()
              if(error) {
                console.log(error)
              }
            }}>
              Logout
            </button>
        </div>) : (
          <div className = "login">
          <Auth supabaseClient = {supabase} socialLayout = "horizontal" socialButtonSize = "xlarge" />
        </div>
        )
      }
      <div class="wrapper">
      <div class="box one"></div>
      <div class="box two"></div>
      <div class="box three"></div>
    </div>
    <div>
      <h1>Upload and Display Image usign React Hook's</h1>
      {selectedImage && (
        <div>
        <img alt="not fount" width={"250px"} src={URL.createObjectURL(selectedImage)} />
        <br />
        <button onClick={()=>setSelectedImage(null)}>Remove</button>
        </div>
      )}
      <br />
     
      <br /> 
      <input
        type="file"
        name="myImage"
        onChange={(event) => {
          console.log(event.target.files[0]);
          setSelectedImage(event.target.files[0]);
        }}
      />
    </div>

    </main>

    </>
  )
}
