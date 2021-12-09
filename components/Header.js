import Link from 'next/Link'
import { useEffect, useState } from 'react'
import { supabase } from '../utils/supabaseClient'
import { useRouter } from 'next/dist/client/router'
import { Auth } from '@supabase/ui'
import Avatar from './Avatar'


export default function Header({currPage}) {
    const user = supabase.auth.user()
    const [userInfo, setInfo] = useState(null)
    const [collegeName, setCollege] = useState(null)
    const router = useRouter()
    let ranOnce = false
    useEffect(() => {
       
        if (user != null && userInfo == null) {
            console.log("fetching user")
            fetchUser()
        }
        else if (userInfo != null) {
            if (!userInfo.schoolFixed) {
                if (collegeName == null) {
                    fetchSchool()
                    console.log("fetching school...")

                }
                else if(!ranOnce) {
                    console.log("updating school and profile...")

                    updateUserSchool()
                }
            }
            else {
                

                //do nothing, all is well
            }
        }
        
        
    })

    const fetchUser = async () => {
        const {data, error} = await supabase 
        .from("profiles")
        .select()
        .eq("email", user.email)
        if (error) {
            console.log(error)
        }
        else {
            setInfo(data[0])
        }

    }
    const fetchSchool = async () => {
        const {data, error} = await supabase 
        .from("college_emails")
        .select("college")
        .eq("tag", userInfo.school)
        if(error) {
            console.log(error)
        }
        else {
            if(data.length > 0) {
                setCollege(data[0].college)

            }
            else {
                setCollege("Other")
            }
        }
    }
    const updateUserSchool = async () => {
        const {data, error} = await supabase 
        .from("profiles")
        .update({school: collegeName, schoolFixed: true})
        .eq("email", userInfo.email)
        if(error) {
            console.log(error)
        }
        else {
            ranOnce = true
            let tempObj = userInfo
            tempObj.schoolFixed = true 
            setInfo(tempObj)
        }
    }

    return (
        <div class = "HeaderBar">
            
            <nav id = "left">
            <Link href="/">
                <div className="logo">
                
                <svg className="lightbulb" fill="none" viewBox="0 0 24 24" stroke="lightgreen">

  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
  Sorry, your browser does not support inline SVG.  
</svg>
               

                <h1>Learn'N</h1>
                </div>
            </Link>
            <Link href="/groups" className="link"><a id = "navItemLeft" style = {{marginBottom: '0px', marginTop: 'auto', marginLeft: '5vw', borderRadius: '15px 0px 0px 0px', borderRight: 'none', backgroundColor: (currPage == "groups" ? '#3f8d33' : "")}}>Groups</a></Link>
            <Link href="/groups/forums" className="link"><a id = "navItemLeft"   style = {{marginBottom: '0px', marginTop: 'auto',  borderRight: 'none',  borderLeft: 'none', backgroundColor: (currPage == "forums" ? '#3f8d33' : "")}}>Forums</a></Link>
            <Link href="/messages" className="link"><a id = "navItemLeft"   style = {{marginBottom: '0px', marginTop: 'auto',  borderRight: 'none',  borderLeft: 'none', backgroundColor: (currPage == "messages" ? '#3f8d33' : "")}}>Messages</a></Link>

            <a id = "navItemLeft" href = "https://www.youtube.com/watch?v=dQw4w9WgXcQ" style = {{marginBottom: '0px', marginTop: 'auto',  borderRadius: '0px 15px 0px 0px',  borderLeft: 'none'}}>Free Offers</a>
            
            
            </nav>
            <div id = "navRight">
            

                <div className = "dropdown dropdown-6">
                <div id = "navItemRight" onClick = {() => {
                    router.push("/profile/" + userInfo.id)
                }}>
                {
                    (userInfo != null) && (
                        <h1 style = {{marginRight: '15px'}}>{userInfo.full_name}</h1>
                    )
               
                }
                {
                    userInfo != null && (
                        <Avatar
                            url={userInfo.avatar_url}
                            size={64}
                            onUpload={(url) => {
                                setAvatar(url)
                                updateProfile({ avatar_url: url })
                            }
                            }
                            isProfile={false}
                        />
                        
                    )
                }
                </div>
                    <div class="dropdown_menu dropdown_menu--animated dropdown_menu-6">
                        <div class="dropdown_item-1" style={{ paddingTop: '35px' }} id = "fillerItem">&nbsp;</div>
                        <div class="dropdown_item-2" id="fillerItem">Logged in as <a style = {{fontWeight: 'bold'}}>{user != null ? user.email : "gimme a sec"}</a></div>
                        <div class="dropdown_item-5" style={{ borderRadius: '0px 0px 10px 10px' }} id="dropItem">
                            <button className="text-white-800" onClick={async () => {
                                let { error } = await supabase.auth.signOut()
                                if (error) {
                                    console.log(error)
                                }
                                else {
                                    router.push("/")
                                }
                            }}>
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
               
            </div>
      
        </div>
        
        
    )
}