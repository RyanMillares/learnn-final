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

    useEffect(() => {
        if(validGroup == 0){
            if(!isNaN(groupId)) {
                verifyGroup()
            }
            
        }
        else {
            if(hasPerms){
                fetchUsers()
                fetchMembers()
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
                
                
                
    
                console.log(data[0].accepted_members)
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
        const {data1, error1} = await supabase 
        .from("users")
        .select("full_name")
        if(error1) {
            console.log(error1)
        }
        else {
            setMembers(data1)
            console.log(data1)
        }
        
    }
    
    
    return (
        <div>
            <Header/>
        </div>
    )
}