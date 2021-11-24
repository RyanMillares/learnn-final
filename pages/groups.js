import Link from "next/Link";
import Header from "../components/Header";
import { supabase } from "../utils/supabaseClient";
import { useState } from "react";
import { Router } from "next/dist/client/router";
import { useRouter } from "next/dist/client/router";

export default function groups () {
    let user = supabase.auth.user()
    const router = useRouter()
    let [createMode, setMode] = useState(false)
    const [groupName, setName] = useState("")
    const [groupDesc, setDesc] = useState("")
    const [nameList, setNames] = useState([])
    const [num, setNum] = useState("")
    if(user == null) {
        user =  supabase.auth.user()
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
            
            
            router.push("/groups/" + String(data[0].group_id))
        }
    }

    const testPrint = async () => {
        const {data, error} = await supabase
            .from("chatgroups")
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



            {
                testArray.map((test) => (
                    <p>{test[0].name}</p>
                ))
            }
            
            
        </div>
    )
}