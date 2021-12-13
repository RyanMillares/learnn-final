import { supabase } from "../utils/supabaseClient";
import { useRouter } from "next/dist/client/router";
import { useState, useEffect } from "react";
import Header from "../components/Header";
import Head from "next/dist/shared/lib/head";
import NamePicDel from "../components/NamePicDel";
import MessageBody from "../components/MessageBody";

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

export default function messages() {
    let user = supabase.auth.user()
    const router = useRouter()

    const [messages, setMessages] = useState(null)
    const [userInfo, setInfo] = useState(null)
    const [currMsg, setMsg] = useState(null)
    

    useEffect(() => {
        console.log("test")
        if(user == null) {
           fetchUser()
           
        }
        else if(userInfo != null) {
            console.log("ran")

            
        }
        else {
            if(messages == null) {
                fetchMessages()
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
    const fetchMessages = async () => {
        console.log("ran")
        const {data, error} = await supabase 
        .from("pmessages")
        .select()
        .eq("receiver", user.email)
        if(error) {
            console.log(error)
        }
        else {
            setMessages(data)
            console.log(data)
        }
    }
    return (
        <>
            <Header currPage = "messages"/>
            <Head>
                <title>Messages</title>
                <link rel="icon" href="/favicon.ico" />

            </Head>
            <button type = "button" onClick = {() => {
                router.push("/messages")
            }}>Refresh test</button>
            <button type="button" onClick={() => {
                        console.log(messages)
                    }}>click for msgs</button>
            <div className="message_grid">
                <div className="message_container">
                {
                        messages != null && (


                            messages.map(msg => (
                                <div className="msgItem" style = {{cursor: 'pointer'}}onClick = {() => {
                                    setMsg(msg)
                                }}>
                                    <NamePicDel memberEmail = {msg.sender} isInvite = {false}/>
                                    {msg.header}
                                </div>
                            ))


                        )
                    
                }
                </div>
                <div className="message_body">
                    {
                        currMsg != null && (
                            <MessageBody
                            message = {currMsg}
                            />
                        )
                    }
                    
                </div>
            </div>
            


        </>
    )
}