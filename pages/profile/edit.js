import { supabase } from "../../utils/supabaseClient";
import { useState, useEffect } from "react";
import { useRouter } from "next/dist/client/router";
import Header from "../../components/Header";

export default function edit() {
    const [userInfo, setInfo] = useState(null)


    let user = supabase.auth.user()
    
    const router = useRouter()

    
    useEffect(() => {
        if(user == null) {
            fetchUser()
        }
    })
    const fetchUser = async () => {
        const [data, error] = await supabase 
        .from("profiles")
        .select()
        .eq("email", user.email)
        if(error) {
            console.log(error)
        }
        else {
            setInfo(data[0])
        }
    }
    //editing profile
    return (
        <>
            <Header/>
        </>
    )
}