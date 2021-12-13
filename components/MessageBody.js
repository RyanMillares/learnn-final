import NamePicDel from "./NamePicDel"
import { useState, useEffect } from "react"
import { useRouter } from "next/dist/client/router"
import { supabase } from "../utils/supabaseClient"


export default function MessageBody({message}) {
    const user = supabase.auth.user()
    const router = useRouter()

    return (
        <>
            <a>{message.header}</a>
        </>
    )
}