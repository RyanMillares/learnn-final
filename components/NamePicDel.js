import NameAndPic from "./NameAndPic";
import { supabase } from "../utils/supabaseClient";
import { useState, useEfect, useEffect } from "react";

export default function NamePicDel ({memberEmail, deleteEmail, isInvite}) {
    const [userInfo, setInfo] = useState(null)

    useEffect(() => {
        if(userInfo == null) {
            fetchInfo()
        }
    })
    const fetchInfo = async () => {
        const {data, error} = await supabase 
        .from("profiles")
        .select()
        .eq("email", memberEmail)
        if(error) {
            console.log(error)
        }
        else {
            setInfo(data[0])
            
        }
        
    }
    return (
        <div className = "evenMoreGrid" style = {{maxWidth: '230px', maxHeight: '50px', minWidth: '230px', minHeight: '50px'}}>
            {
                userInfo != null && (
                    <>
                    <NameAndPic userInfo = {userInfo}/>
                    <button type = "button" style = {{display: isInvite ? "visible" : "none"}} className = "bg-red-600 text-2xl text-white rounded px-3 py-1 hover:bg-red-500" onClick = {() => {
                        deleteEmail(memberEmail)
                       
                    }}>X</button>
                    </>
                )
            }
           
        </div>
    )
}