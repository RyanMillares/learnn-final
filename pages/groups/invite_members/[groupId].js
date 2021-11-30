import { useRouter } from "next/dist/client/router";
import { useState, useEffect } from "react";
import Header from "../../../components/Header";
import { supabase } from "../../../utils/supabaseClient";

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

    const [userList, setUsers] = useState("")
    const [memberList, setMembers] = useState("")
    const [groupInfo, setInfo] = useState({})

    useEffect(() => {
        if(validGroup == 0){
            if(!isNaN(groupId)) {
                verifyGroup()
            }
            
        }
        else {
            if(hasPerms){
                fetchUsers()
                //fetchMembers()
            }   

        }
        //console.log(typeof groupId)
               
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
        .select("full_name")
        if(error) {
            console.log(error)
        }
        else {
            setMembers(data)
            console.log(data)
        }
        
    }
    
    
    return (
        <div>
            <Header/>
            <button type = "button" className = "bg-green-500" onClick = {() => {
                fetchMembers()
            }}>Click me</button>
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
                        <h1 className="text-center font-bold text-3xl">You are not the creator.</h1>
                    ) : ( //creator, main block
                        <h1 className="text-center font-bold text-3xl">Inviting members to {groupInfo.group_name}...</h1>
                        
















                    )
                   )
                )
            }
            
        </div>
    )
}