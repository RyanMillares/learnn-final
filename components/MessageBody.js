import NamePicDel from "./NamePicDel"
import { useState, useEffect } from "react"
import { useRouter } from "next/dist/client/router"
import { supabase } from "../utils/supabaseClient"

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

export default function MessageBody({message}) {
    const user = supabase.auth.user()
    const router = useRouter()
    
    const acceptInvite = async () => {

    }

    return (
        <div className = "messageBody">
            <h1 style = {{fontSize: '20px', fontWeight: 'bold'}}>{message.header}</h1>
            <a style = {{float: 'right'}}>Sent:<br/> {String(new Date(new Date(message.date_sent).getTime())).slice(4, 15)} {convertedTime(String(new Date(new Date(message.date_sent).getTime())).slice(16, 21)).convTime} {convertedTime(String(new Date(new Date(message.date_sent).getTime())).slice(16, 21)).isPM ? "PM" : "AM"}</a>

            From: <NamePicDel memberEmail = {message.sender} isInvite = {false}/>
            <p>"{message.content}"</p><br/>
            {
                message.isInvite && (
                    <>
                        <h1>You have been officially invited to join the group: {message.header.slice(message.header.indexOf(":") + 1)}</h1>
                    </>
                )
            }
        </div>
    )
}