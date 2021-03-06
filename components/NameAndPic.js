import { supabase } from "../utils/supabaseClient"
import { useEffect, useState } from "react"
import Link from "next/link"


export default function NameAndPic({userInfo}) {
    const [blob, setBlob] = useState(null)
    useEffect(() => {
        if(blob == null) {
            downloadImage(userInfo.avatar_url)
            console.log(userInfo)
        }
    })

    async function downloadImage(path) {
        console.log(path)
        try {
          const { data, error } = await supabase.storage.from('avatars').download(path)
          if (error) {
            //throw error
            console.log(error)
          }
          const url = URL.createObjectURL(data)
          //console.log(url)

          setBlob (url)
          
        } catch (error) {
          console.log('Error downloading image: ', error.message)
          setBlob ("../images/default.jpg")

        }
      }


    return (
        <div className = "groupMemberItem">
            <Link style = {{cursor: 'pointer'}}href={"/profile/" + userInfo.id}>
                
                
                <h1 style= {{ cursor: 'pointer' }} className="text-left responsive_text2" > <img src= {blob != null ? blob : "../images/default.jpg"} className = "responsive_chatImg" style={{marginBottom: '5px', borderRadius: '100%', overflow: 'hidden', display: 'inline',whiteSpace: 'nowrap', cursor: 'pointer'}} /> {userInfo.full_name}</h1>
                
            </Link>
        </div>
    )
}