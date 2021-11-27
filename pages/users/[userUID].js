import Header from "../../components/Header"
import { useEffect, useState } from 'react'
import { useRouter } from "next/dist/client/router"

import { supabase } from '../../utils/supabaseClient'
export default function userProfile() {

    let user = supabase.auth.user()
    if(user == null) {
        user =  supabase.auth.user()
    }
    const router = useRouter()
    const userId = router.query.groupId

    useEffect(() => {
        
    })
    const fetchUserInfo = async () => {
        
    }


    return (
        <>
            <Header/>

        </>
    )
}