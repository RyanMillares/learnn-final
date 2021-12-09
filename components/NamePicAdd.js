import NameAndPic from "./NameAndPic";
import { supabase } from "../utils/supabaseClient";

export default function NamePicAdd ({memberInfo, addEmail}) {
    return (
        <div className = "evenMoreGrid" style = {{maxWidth: '230px', maxHeight: '50px', minWidth: '230px', minHeight: '50px'}}>
        <NameAndPic userInfo = {memberInfo}/>
        <button type = "button" className = "bg-green-600 text-2xl text-white rounded px-3 py-1 hover:bg-green-500"  onClick = {() => {
            addEmail(memberInfo.email)
                        
                    }}>+</button>
        </div>
    )
}