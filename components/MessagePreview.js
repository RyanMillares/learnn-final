import { supabase } from "../utils/supabaseClient";
import { useState } from "react";
import NamePicDel from "./NamePicDel";

function convertedDate(date_string) {

    let splitDate = date_string.split(" ")
    let convMonth = monthToNum1(splitDate[0])
    let convDate = convMonth + "/" + splitDate[1] + "/" + splitDate[2]
    return convDate

}

function convertedTime(time_string) {
    let currHour = parseInt(time_string.slice(0, 2), 10)
    let isPM = (currHour > 12)
    let newHour = (isPM ? currHour - 12 : (currHour > 0) ? currHour : 12)
    let convTime = String(newHour) + time_string.slice(2,)
    return {convTime, isPM}

}


export default function MessagePreview({msg, msgSetter, currMsgId}) {

    const [hasRead, setRead] = useState(msg.hasRead)

    const readMsg = async () => {
        const {data, error} = await supabase 
        .from("pmessages")
        .update({hasRead: true})
        .eq("pmessage_id", msg.pmessage_id)
        if(error) {
            console.log(error)
        }
        else {
            setRead(true)
        }
    }
    return (
        <div className="msgItem"  style = {{cursor: 'pointer', borderWidth: hasRead ? '' : '3px', boxShadow: hasRead ? '' : '2px 4px 6px rgba(0, 0, 0, 0.5)', backgroundColor: currMsgId == msg.pmessage_id ? 'rgb(150, 226, 150)' : ''}} onClick = {() => {
            msgSetter(msg)
            if(!msg.hasRead) {
                readMsg()

            }
        }}>
            <a className = "responsive_text2" style = {{float: 'right'}}>{String(new Date(new Date(msg.date_sent).getTime())).slice(4, 15)} {convertedTime(String(new Date(new Date(msg.date_sent).getTime())).slice(16, 21)).convTime} {convertedTime(String(new Date(new Date(msg.date_sent).getTime())).slice(16, 21)).isPM ? "PM" : "AM"}</a>

            <NamePicDel memberEmail = {msg.sender} isInvite = {false}/>
            <a className = "responsive_text4" style = {{fontWeight: hasRead ? '' : 'bold', }}>{msg.header}</a>
        </div>
    )
}