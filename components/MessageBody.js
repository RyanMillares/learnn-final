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
    const [groupInfo, setInfo] = useState(null)

    useEffect(() => {
        if(message.isInvite) {
            if(groupInfo == null) {
                fetchGroup()
            }
        }
        else {
            setInfo(null)
        }
    })
    const fetchGroup = async () => {
        const {data, error} = await supabase
        .from("groupchats")
        .select()
        .eq("group_id", message.groupId)
        if(error) {
            console.log(error)
        }
        else {
            setInfo(data[0])
        }
    }
    let acceptInvite = () => {
        updateGroupInfo()
        updateInvite()
    }
    const updateGroupInfo = async () => {
        let invArray = groupInfo.invited_members.split(" ")
        let newAccepted = groupInfo.accepted_members + " " + user.email
        const invIndex = invArray.indexOf(user.email)
        if(invIndex > -1) {
            invArray.splice(invIndex, 1)

        }
        let newInvited = invArray.length > 0 ? invArray.join(" ") : ""
        const {data, error} = await supabase
        .from("groupchats")
        .update({accepted_members: newAccepted, invited_members: newInvited})
        .eq("group_id", message.groupId)
        if(error) {
            console.log(error)

        }
        

        
    }
    const updateInvite = async () => {
        const {data, error} = await supabase
        .from("pmessages")
        .update({hasDecided: true})
        .eq("pmessage_id", message.pmessage_id)
        if(error) {
            console.log(error)
        }
    }
    console.log(message.sender)

    return (
        <div className = "messageBody">
            <h1 style = {{fontSize: '20px', fontWeight: 'bold'}}>{message.header}</h1>
            <a style = {{float: 'right'}}>Sent:<br/> {String(new Date(new Date(message.date_sent).getTime())).slice(4, 15)} {convertedTime(String(new Date(new Date(message.date_sent).getTime())).slice(16, 21)).convTime} {convertedTime(String(new Date(new Date(message.date_sent).getTime())).slice(16, 21)).isPM ? "PM" : "AM"}</a>

            From: <NamePicDel memberEmail = {message.sender} isInvite = {false} key = {message.sender}/>
            <p>{message.isInvite ? "\"" : ""}{message.content}{message.isInvite ? "\"" : ""}</p><br/><br/>
            {
                message.isInvite && (
                    <>
                        <h1>You have been officially invited to join the group: <a style = {{fontWeight: 'bold'}}>{message.header.slice(message.header.indexOf(":") + 1)}</a>. To accept this invite, simply click the button below. You will return to your groups page and should be able to see the new group in your list.</h1><br/>
                        {
                            groupInfo != null && (
                                <button type = "button" className = {message.hasDecided ? "bg-gray-600 text-gray-300 rounded px-3 py-1 " : "bg-green-600 text-white rounded px-3 py-1 hover:bg-green-500"} onClick = {() => {
                                    if(!message.hasDecided) {
                                        acceptInvite()
                                        alert("Successfully joined" + message.header.slice(message.header.indexOf(":") + 1) + "!\n\nIt may take a few additional seconds for this to be processed. If your new group does not show up in your list immediately, refresh the page after a few seconds.")
                                        router.push("/groups")
                                    }
                                    else {
                                        alert("This invite has either been accepted or expired. "+"Please contact the group admin for another invite if needed")
                                    }
                                    
                                }}>{message.hasDecided ? "Invalid/Expired Invite" : "Join "+ message.header.slice(message.header.indexOf(":") + 1)}</button>
                            )
                        }
                    </>
                )
            }
        </div>
    )
}