import { useRouter } from "next/dist/client/router";
import { useState, useEffect } from "react";
import Header from "../../../components/Header";
import { supabase } from "../../../utils/supabaseClient";
import NamePicAdd from "../../../components/NamePicAdd";
import NameAndPic from "../../../components/NameAndPic";
import NamePicDel from "../../../components/NamePicDel";
import InvitedMembers from "../../../components/InvitedMembers";
import Head from "next/dist/shared/lib/head";
import { Auth } from "@supabase/ui";

export default function InviteMembers() {
    
    const {user} = Auth.useUser()
    const router = useRouter()
    const groupId = parseInt(router.query.groupId, 10)
    const [usersLoaded, setLoaded] = useState(false)
    const [validGroup, setValid] = useState(0)
    const [hasPerms, setPerms] = useState(false)

    const [userList, setUsers] = useState(null)
    const [memberList, setMembers] = useState(null)
    const [groupInfo, setInfo] = useState({})
    const [invites, setInvites] = useState([])
    const [invMsg, setMsg] = useState("")
    const [confirm, setConfirm] = useState(false)

    useEffect(() => {
        lmao()
        if(validGroup == 0){
            if(!isNaN(groupId)) {
                verifyGroup()
            }
            
        }
        else {
            if(hasPerms){ //break this or else inf loop
                if(userList == null || memberList == null) {
                    fetchUsers()
                    fetchMembers()
                }

            }   

        }
        //console.log(typeof groupId)
        console.log(invites)

               
    })
    
    const verifyGroup = async () => {
        //console.log(groupId)
        
        const { data, error} = await supabase
            .from('groupchats')
            .select()
            .eq("group_id", groupId)
        if(error) {
            console.log(error)
            
        }
        if(data != null) {
            setValid(data.length == 1 ? 2 : 1)
            if(data.length > 0) {
            
                setPerms(data[0].creator == user.email)
                setInfo(data[0])
                
                
                
    
                //console.log(data[0].accepted_members)
            } 
            
        }
        if(validGroup){
            
        }
        
    }
    const fetchUsers = async () => {
        const {data, error} = await supabase 
        .from("groupchats")
        .select("accepted_members")
        .eq("group_id", groupId)
        if(error) {
            console.log(error)
        }
        else {
            setUsers(data[0].accepted_members)
            console.log(data[0].accepted_members)
        }
        
    }
    const fetchMembers = async () => {
        const {data, error} = await supabase 
        .from("profiles")
        .select()
        .match({schoolFixed: true, isPublic: true})
        if(error) {
            console.log(error)
        }
        else {
            setMembers(data)
            console.log(data)
        }
        
    }
    const sendInvites = () => {
        invites.map( invitee => (
            sendInvite(invitee)
        ))
        updateGroup()
        router.push("/groups")
        
        
    }
    const updateGroup = async () => {
        let addedInvites = groupInfo.invited_members + (groupInfo.invited_members != null ? " " : "") + (invites.filter(invite1 => !groupInfo.invited_members.includes(invite1))).filter(invite2 => !groupInfo.accepted_members.includes(invite2)).join(" ")
        const { data, error } = await supabase
            .from('groupchats')
            .update({ invited_members: addedInvites })
            .eq("group_id", groupId)

        if(error) {
            console.log(error)
        }

    }
    const sendInvite = async (email) => {
        if(!groupInfo.invited_members.includes(email)) {
            if(!groupInfo.accepted_members.includes(email)) {
                const {data, error} = await supabase 
                .from("pmessages")
                .insert([
                    {sender: user.email, 
                        receiver: email, 
                        header: ('You are invited to: ' + groupInfo.group_name), 
                        content: invMsg, 
                        date_sent: new Date().getTime(),
                        isInvite: true,
                        groupId: groupId,
        
                    },
                ])
                
                if(error) {
                    console.log(error)
                }
            }
            else {
                console.log(email + " is already a member of the group")

            }
            
        }
        else {
            console.log(email + " is already invited")

        }
        


    }
    const lmao = () => {
        console.log(invites)
    }
    const addEmail = async (email) => {
        if(!invites.includes(email)) {
            setInvites([...invites, email])

        }
        lmao()
    }
    const removeEmail = async (email) => {
        let tempArray = [...invites]
        const index = tempArray.indexOf(email)
        if(index > -1) {
            tempArray.splice(index, 1)
        }
        setInvites(tempArray)
        lmao()
    }
    
    
    return (
        <body>
            <Header currPage = "groups"/>
            {
                confirm && (
                    <div style={{ alignContent: 'center', overflow: 'hidden' }}>
                    <div className ="input-focused" id = "groupForm">
                       
                    </div>
                </div>
                )
            }
            <button type = "button" onClick = {() => {
                lmao()
            }}>Click for invites list</button>
            {
                validGroup == 0 ? ( //not loaded
                    <div style = {{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                    <h1 className="text-center font-bold text-4xl">Fetching data...</h1>
                    <div class="wrapper" style = {{marginTop: '15px', marginBottom:'15px'}}>
                        <div class="box one"></div>
                        <div class="box two"></div>
                        <div class="box three"></div>
                    </div>
                    
                </div>
                ) : (
                   validGroup == 1 ? ( //not valid
                    <h1 className="text-center font-bold text-3xl">The group you are trying to access does not exist.</h1>
                   ) : ( //valid
                    !hasPerms ? ( // not creator
                        <>
                        <Head>
                            <title>Inviting members to {groupInfo.group_name}...</title>
                            <link rel="icon" href="/favicon.ico" />
                        </Head>
                        <h1 className="text-center font-bold text-3xl">You lack invite permissions for {groupInfo.group_name}</h1>
                        <p className = "text-center">go away lol</p>
                        </>
                    ) : ( //creator, main block
                        <>
                        <Head>
                            <title>Inviting members to {groupInfo.group_name}...</title>
                            <link rel="icon" href="/favicon.ico" />
                        </Head>
                                            {
                                                confirm && (
                                                    <div style={{ alignContent: 'center', overflow: 'hidden' }}>
                                                        <div className="input-focused-invites">
                                                            <form>
                                                                <h1 className="text-center text-2xl font-bold">Invite Confirmation</h1><br/>

                                                                <h1 className="text-left font-bold">Sending invites to {invites.length} users to {groupInfo.group_name} </h1>
                                                                <h2>Add a message (optional): </h2><textarea type="text" id="groupdesc" style={{ width: '70vw', maxWidth: '100%', marginBottom: '5px' }} placeholder="Enter invite message" value={invMsg} className="border-2 border-blue-400 rounded px-3 py-2 " onChange={(e) => setMsg(e.target.value)} />
                                                                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                                                    <button type="cancel" className="bg-red-600 rounded px-12 py-2 hover:bg-red-500" onClick={() => {
                                                                        setConfirm(false)
                                                                    }}>Cancel</button>
                                                                    <button type="button" className="bg-green-500 rounded px-12 py-2 hover:bg-green-400" onClick={() => {
                                                                        sendInvites()
                                                                    }}>Confirm</button>
                                                                </div>
                                                            </form>

                                                        </div>
                                                    </div>
                                                )
                                            }
                        <h1 className="text-center font-bold text-3xl">Inviting members to {groupInfo.group_name}...</h1>
                                            <div className="mainInviteGrid">
                                               <div></div>
                                                <div className ="membersInviteBox">
                                                    {
                                                        memberList != null && (
                                                            memberList.map(member => (
                                                                <NamePicAdd 
                                                                memberInfo = {member}
                                                                addEmail = {addEmail}
                                                                key = {member}
                                                                />
                                                            ))

                                                            
                                                        )
                                                    }
                                                    
                                                </div>
                                                <div className = "gridWithBottom">
                                                    <div className = "responsive_text" style = {{textAlign: 'center',backgroundColor: '#98ff98'}}>
                                                        Selected Members
                                                    </div>
                                                    <div className = "invitedMembersGrid">
                                                        <InvitedMembers
                                                        invites = {invites}
                                                        removeEmail = {removeEmail}/>
                                                    </div>
                                                    <div style = {{backgroundColor: '#98ff98' ,alignItems: 'center', alignContent: 'center', paddingTop: '5px'}}>
                                                        <center><button type = "button" style = {{fontSize: '18px'}} className = "bg-green-600 text-white rounded px-3 py-1 hover:bg-green-500" onClick = {() => {
                                                            if(invites.length > 0) {
                                                                setConfirm(true)

                                                            }
                                                            else {
                                                                alert("You have not selected any users to invite yet.")
                                                            }
                                                        }}>Send Invites</button></center>
                                                            
                                                    </div>
                                                </div>
                                                

                                            </div>
                       
                        </>
                        



                    )
                   )
                )
            }
            
        </body>
    )
}