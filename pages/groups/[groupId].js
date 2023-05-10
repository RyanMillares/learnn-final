import ChatItem from "../../components/ChatItem"
import Head from "next/dist/shared/lib/head"
import Header from "../../components/Header"
import { useEffect, useState } from 'react'
import Input from "../../components/Input"
import Link from "next/link"
import { useRouter } from "next/dist/client/router"
import NameAndPic from "../../components/NameAndPic"
import { Auth } from "@supabase/ui"

import { supabase } from '../../utils/supabaseClient'

function compare(a, b) {

    const bandA = a.date_sent;
    const bandB = b.date_sent;

    let comparison = 0;
    if (bandA > bandB) {
        comparison = 1;
    } else if (bandA < bandB) {
        comparison = -1;
    }
    return comparison;
}

export default function groupchat() {
    //const { name } = Auth.useUser()
    //console.log(name.user)
    //const currentName = "rmillares" //this is default, idk how to carry over username yet

    const testBool = true
    const { user } = Auth.useUser()
    const router = useRouter()
    let groupId = parseInt(router.query.groupId, 10)


    const badWords = [" kill ", "suicide", "murder"]

    const [forumTests, setForumTests] = useState([])

    const [error, setError] = useState(null)
    const [lastUser, setLastUser] = useState("")
    const [isSame, setSame] = useState([])
    const [allowedUsers, setAllowed] = useState("")
    const [memberInfo, setMembers] = useState([])
    const [inviteInfo, setInvites] = useState([])

    const [validGroup, setValid] = useState(0)
    const [hasPerms, setPerms] = useState(false)
    const [groupInfo, setInfo] = useState({})

    useEffect(() => {
        if (validGroup == 0) {
            if (!isNaN(groupId)) {
                verifyGroup()
            }

        }
        else {
            if (hasPerms) {
                fetchMessages()
                //console.log('nhbjg')
                if (groupInfo != null && memberInfo.length == 0) {
                    fetchMembers(groupInfo)
                }
                else {
                    //console.log(memberInfo)
                }
            }

        }
        //console.log(typeof groupId)

    })

    const verifyGroup = async () => {
        //console.log(groupId)
        if (isNaN(groupId)) {
            console.log("not a number")
        }
        else {
            console.log("completely valid")
            console.log(groupId)
        }
        const { data, error } = await supabase
            .from('groupchats')
            .select()
            .eq("group_id", groupId)
        if (error) {
            console.log(error)

        }
        if (data != null) {
            setValid(data.length == 1 ? 2 : 1)
            if (data.length > 0) {
                setAllowed(data[0].accepted_members)
                setPerms(data[0].accepted_members.indexOf(user.email) > -1)
                console.log("Does the group exist? " + data.length)
                console.log("Who is allowed?" + data[0].accepted_members)
                console.log(data[0].accepted_members.indexOf(user.email))
                console.log(data[0].accepted_members + " should contain: " + user.email)
                setInfo(data[0])


                console.log(data[0].accepted_members)
            }

        }
        if (validGroup) {

        }

    }

    const fetchMembers = async (memberList) => {
        if (memberList.accepted_members != null) {

            let acceptedArray = memberList.accepted_members.split(" ")
            const { data: accepted, error } = await supabase
                .from("profiles")
                .select()
                .in("email", acceptedArray)
            if (error) {
                console.log(error)
            }
            else {
                if (accepted != null) {
                    //console.log(members)
                    setMembers(accepted)
                }
                else {
                    console.log("this error")
                }
            }


        }
        if (memberList.invited_members != null) {
            let invitedArray = memberList.invited_members.split(" ")
            const { data: invited, error } = await supabase
                .from("profiles")
                .select()
                .in("email", invitedArray)
            if (error) {
                console.log(error)
            }
            else {
                if (invited != null) {
                    //console.log(members)
                    setInvites(invited)
                }
                else {
                    console.log("this other error")
                }
            }

        }


    }
    const fetchMessages = async () => {
        //fetch sql data

        let { data: messages, error } = await supabase
            .from("groupmsgs")
            .select()
            .eq("group_id", groupId)



        if (messages != null) {

            messages.sort(compare)
        }

        if (!error) {

            setForumTests(messages)
        }
        else {
            console.log(error)
        }

    }



    const addMessage = async (msg) => {
        let errorCode = 0 //0 = fine, 1 = blacklisted word, 2 = only white-space
        let flag1 = true
        let currWord = ""
        if (msg.length == 0 || !(msg.trim().length)) { // thanks https://stackoverflow.com/questions/17524290/how-to-check-for-string-having-only-spaces-in-javascript
            flag1 = false
            errorCode = 2
        }
        else {
            for (let i = 0; i < badWords.length; i++) {
                if (msg.includes(badWords[i])) {
                    flag1 = false
                    currWord = badWords[i]
                    errorCode = 1
                    break
                }
            }
        }


        if (flag1) {
            //console.log("reached")
            let brandNewDate = new Date().getTime()
            const { data, error } = await supabase
                .from("groupmsgs")
                .insert([
                    { group_id: groupId, sender: user.email, date_sent: brandNewDate, message: msg }])
            if (!error) {
                setForumTests([...forumTests, { 'sender': user.email, 'date_sent': brandNewDate, 'message': msg }])
            }
            else {
                console.log(error)
            }

            console.log(brandNewDate)
        }
        else {
            switch (errorCode) {
                case 1:
                    alert("Your message:\n\n" + msg + "\n\ncontained the word [" + currWord + "], which is not allowed, thus your message failed to send.")
                    break
                case 2:
                    alert("Your message is either blank or contains only white-space. Please ensure your message is an actual message. ;)")
            }
        }
        const theElement = document.getElementById('forumPage');

        const scrollToBottom = (node) => {
            node.scrollTop = node.scrollHeight;
        }

        scrollToBottom(theElement);


    }



    return (
        <div>
            <Header currPage="groups" />

            {
                validGroup == 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                        <h1 className="text-center font-bold text-4xl">Fetching data...</h1>
                        <div class="wrapper" style={{ marginTop: '15px', marginBottom: '15px' }}>
                            <div class="box one"></div>
                            <div class="box two"></div>
                            <div class="box three"></div>
                        </div>

                    </div>
                ) : (
                    <>
                        {
                            validGroup == 1 ? (
                                <>
                                    <h1 className="text-center font-bold text-3xl">The group you are trying to access does not exist.</h1>
                                    {
                                        setTimeout(() => { router.push("https://www.youtube.com/watch?v=dQw4w9WgXcQ") }, 2000)
                                    }
                                </>
                            ) : (
                                <>
                                    {
                                        !hasPerms ? (
                                            <>
                                                <h1 className="text-center font-bold text-3xl">You do not have permission to access this group.</h1>
                                                {
                                                    //setTimeout(() => {  router.push("https://www.youtube.com/watch?v=dQw4w9WgXcQ") }, 2000)
                                                    console.log("hello")
                                                }
                                            </>
                                        ) : (
                                            <>
                                                <Head>
                                                    <title>{groupInfo.group_name}</title>
                                                    <link rel="icon" href="/favicon.ico" />

                                                </Head>
                                                {
                                                    <>
                                                        <span style={{ float: 'left' }}>

                                                        </span>
                                                        {
                                                            user != null && (
                                                                <h1 className="text-center font-bold responsive_text">Welcome {(user.email).split("@")[0]} to {groupInfo.group_name}</h1>
                                                            )
                                                        }
                                                    </>

                                                }
                                                <div class="forumEnter">
                                                    {
                                                        false && (
                                                            <h1 style={{ fontSize: '32' }}>Forums</h1>
                                                        )
                                                    }


                                                </div>
                                                <div className="forumOrg">
                                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                        <div id="forumPage" class="forumPage">

                                                            <div id="forums" className="forums">
                                                                {
                                                                    forumTests.length > 0 && (
                                                                        forumTests.map((forum, i) => (

                                                                            (forum != null) && (
                                                                                <ChatItem
                                                                                    sender={forum.sender}
                                                                                    date_sent={forum.date_sent}
                                                                                    message={forum.message}
                                                                                    msgId={forum.msg_id}
                                                                                    table="groupmsgs"
                                                                                    updater={fetchMessages}
                                                                                    isNew={i > 0 ? (forumTests[i].sender != forumTests[i - 1].sender || (forumTests[i].date_sent - forumTests[i - 1].date_sent > 3600000) && forumTests[i].sender == forumTests[i - 1].sender) : true

                                                                                    }
                                                                                    newDay={i > 0 ? String(new Date(forumTests[i].date_sent)).slice(8, 10) != String(new Date(forumTests[i - 1].date_sent)).slice(8, 10) : true} />
                                                                            ))
                                                                        )

                                                                    )
                                                                    //forumTests.slice(0).reverse().map((forum) => (

                                                                }

                                                            </div>

                                                        </div>
                                                        <div class="forumEnter">
                                                            <Input handleSubmit={addMessage} buttonText="Send" />

                                                        </div>
                                                    </div>

                                                    <div className="forumMembers">
                                                        {
                                                            <div className="forum_accepted" style={{ display: 'flex', flexDirection: 'column' }}>
                                                                <h1 className="text-left font-bold responsive_text" style={{ paddingBottom: '5px' }}>Accepted Members</h1>
                                                                {

                                                                    memberInfo != null && (

                                                                        memberInfo.map(member => (


                                                                            <NameAndPic
                                                                                userInfo={member}
                                                                            />




                                                                        ))
                                                                    )
                                                                }

                                                            </div>

                                                        }
                                                        {
                                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                                <div className="forum_invited">

                                                                    <h1 className="text-left font-bold responsive_text" style={{ paddingBottom: '5px' }}>Invited Members</h1>
                                                                    {

                                                                        inviteInfo != null && (
                                                                            inviteInfo.map(invitee => (

                                                                                <Link href={"/profile/" + invitee.id}>
                                                                                    <>
                                                                                        <NameAndPic
                                                                                            userInfo={invitee}
                                                                                        />

                                                                                    </>
                                                                                </Link>

                                                                            ))
                                                                        )
                                                                    }
                                                                </div>
                                                            </div>
                                                        }

                                                    </div>
                                                </div>


                                            </>
                                        )
                                    }
                                </>
                            )
                        }
                    </>

                )
            }



        </div>
    )
}