import { useRouter } from "next/dist/client/router";
import { useState, useEffect } from "react";
import Header from "../../../components/Header";
import { supabase } from "../../../utils/supabaseClient";
import NamePicAdd from "../../../components/NamePicAdd";
import NameAndPic from "../../../components/NameAndPic";
import NamePicDel from "../../../components/NamePicDel";
import InvitedMembers from "../../../components/InvitedMembers";
import Head from "next/dist/shared/lib/head";

export default function InviteMembers() {
    
    let user = supabase.auth.user()
    if(user == null) {
        user =  supabase.auth.user()
    }
    const router = useRouter()
    const groupId = parseInt(router.query.groupId, 10)
    const [usersLoaded, setLoaded] = useState(false)
    const [validGroup, setValid] = useState(0)
    const [hasPerms, setPerms] = useState(false)

    const [userList, setUsers] = useState(null)
    const [memberList, setMembers] = useState(null)
    const [groupInfo, setInfo] = useState({})
    const [invites, setInvites] = useState([])
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
            setUsers(data[0])
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
        <div>
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
                        <h1 className="text-center font-bold text-3xl">Inviting members to {groupInfo.group_name}...</h1>
                                            <div className="mainInviteGrid">
                                                <div></div>
                                                <div className ="membersInviteBox">
                                                    {
                                                        memberList != null && (
                                                            memberList.map(member => (
                                                                <NamePicAdd 
                                                                memberInfo = {member}
                                                                addEmail = {addEmail}/>
                                                            ))
                                                            
                                                        )
                                                    }
                                                    
                                                </div>
                                                <div className = "gridWithBottom">
                                                    <div style = {{textAlign: 'center' ,fontSize: '20px',backgroundColor: '#98ff98'}}>
                                                        Selected Members
                                                    </div>
                                                    <div className = "invitedMembersGrid">
                                                        <InvitedMembers
                                                        invites = {invites}
                                                        removeEmail = {removeEmail}/>
                                                    </div>
                                                    <div style = {{backgroundColor: '#98ff98' ,alignItems: 'center', alignContent: 'center'}}>
                                                        <center><button type = "button" className = "bg-green-600 text-2xl text-white rounded px-3 py-1 hover:bg-green-500" onClick = {() => {

                                                        }}>Send Invites</button></center>
                                                            
                                                    </div>
                                                </div>
                                                

                                            </div>
                       
                        </>
                        



                    )
                   )
                )
            }
            
        </div>
    )
}