import Link from "next/Link";
import Header from "../components/Header";
import { supabase } from "../utils/supabaseClient";
import { useState, useEffect } from "react";
import { Router } from "next/dist/client/router";
import { useRouter } from "next/dist/client/router";
import GroupPanel from "../components/GroupPanel";

export default function groups () {
    let user = supabase.auth.user()
    const router = useRouter()
    let [createMode, setMode] = useState(false)
    const [groupName, setName] = useState("")
    const [groupDesc, setDesc] = useState("")
    const [groupsFound, setFound] = useState(false)
    const [groupList, setGroups] = useState([])


    if(user == null) {
        user =  supabase.auth.user()
    }

    useEffect(() => {
        if(user != null && !groupsFound) {
            fetchGroups()
            
        }
    })
    const fetchGroups = async () => {
        console.log("test")
        const { data, error } = await supabase
        .from("groupchats")
        .select()
        .like("accepted_members", "%" + user.email + "%")
        if(error) {
            console.log(error)
        }
        else {
            setFound(true)
            setGroups(data)
            console.log(data)
        }
    }
    const fetchMembers = async (memberList) => {
        if (memberList != null) {
            let memberArray = memberList.split(" ")
            const { data: members, error } = await supabase
                .from("profiles")
                .select()
                .in("email", memberArray)
            if (error) {
                console.log(error)
            }
            else {
                if (members != null) {
                    //console.log(members)
                    setMembers(members)
                }
                else {
                    console.log("this error")
                }
            }

        }

    }

    let testNum = String(1234)
    let newGroupId = "/group/" + testNum
    let testArray = [
        [{name: "ryan", number: 3}, true],
        [{name: "yanr", number: 5}, false],
        [{name: "noah", number: 7}, true]
    ]

    const createGroup = async () => {
        const { data, error } = await supabase
            .from("groupchats")
            .insert([
            { group_name: groupName, creator: user.email, description: groupDesc, accepted_members: user.email + " ", invited_members: ""}])
        
        if (error) {
            console.log(error)
        }
        else {
            
            
            router.push("/groups/invite_members/" + String(data[0].group_id))
        }
    }

    const testPrint = async () => {
        const {data, error} = await supabase
            .from("groupchat")
            .select("accepted_members")
            .eq("group_id", 6)
        //setNum(data.length)
        console.log(data)
    }



    return (
        <div>
            
            <Header />
            {
                //create group mode
                createMode && (
                    <div style={{ alignContent: 'center', overflow: 'hidden' }}>
                        <div class="input-focused">
                            <form>
                            <h1 className = "text-center font-bold">Create New Group</h1>
                                <h2>Group Name: </h2><input type = "text" id = "groupname" style = {{width: '70vw', maxWidth: '100%'}} placeholder = "Enter group name" value = {groupName} className = "border-2 border-blue-400 rounded px-3 py-2 " onChange = {(e) => setName(e.target.value)}/>
                                <h2>Group Description: </h2><textarea type = "text" id = "groupdesc" style = {{width: '70vw', maxWidth: '100%',marginBottom: '5px'}} placeholder = "Enter group description" value = {groupDesc} className = "border-2 border-blue-400 rounded px-3 py-2 " onChange = {(e) => setDesc(e.target.value)}/>
                                <div style = {{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                                    <button type = "cancel" className = "bg-red-500 rounded px-12 py-2" onClick = {() => {
                                        setMode(false)
                                    }}>Cancel</button>
                                    <button type = "button" className = "bg-green-500 rounded px-12 py-2" onClick = {() => {
                                        createGroup()
                                    }}>Submit</button>
                                </div>
                            </form>
                           
                        </div>
                    </div>
                )
            }
            
            <button type = "button" className = "bg-yellow-500 rounded px-12 py-2" onClick = {() => {
                createGroup()
            }} >Insert test group</button>

            <Link href= {newGroupId} className="link"><a>Groups</a></Link><br/>
            
            
            <button type = "submit" id = "test" className = "bg-green-600 rounded px-12 py-2" onClick = {
                () => {
                    setMode(!createMode)
                }
            }>Click for Window</button>
            <section class = "container_groups">
            {
                groupList != null && (
                    groupList.map(group => (
                        <GroupPanel
                        name = {group.group_name}
                        id = {group.group_id}
                        description = {group.description}
                        img_url = ""
                        members = {group.accepted_members}
                        />


                        
                    ))
                )
            }
            </section>

            {
                testArray.map((test) => (
                    <p>{test[0].name}</p>
                ))
            }
            
            
        </div>
    )
}