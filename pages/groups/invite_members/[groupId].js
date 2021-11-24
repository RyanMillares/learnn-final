import { useRouter } from "next/dist/client/router";
import { useState, useEffect } from "react";
import Header from "../../../components/Header";
import { supabase } from "../../../utils/supabaseClient";

export default function InviteMembers() {
    const obj1 = "hi"
    const obj2 = "yes"
    const lmao = "no"
    const colours = {obj1, obj2, lmao}
    const character = () => {const [choice, setSelected] = useState(colours.normal)}
    console.log(character)
    let user = supabase.auth.user()
    if(user == null) {
        user =  supabase.auth.user()
    }
    const router = useRouter()
    const groupId = router.query.groupId

    return (
        <div>
            <Header/>
        </div>
    )
}