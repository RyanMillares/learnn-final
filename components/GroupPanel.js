import { useEffect, useState } from "react"
import { supabase } from "../utils/supabaseClient"
import Link from "next/Link"

export default function GroupPanel({name, id, description, img_url, members}) {
    const [memberList, setMembers] = useState("")

    useEffect(() => {
        fetchMembers(members)
    })


    const fetchMembers = async (memberList) => {
        if (memberList != null) {
            let memberArray = memberList.split(" ")
            const { data: members, error } = await supabase
                .from("profiles")
                .select("full_name")
                .in("email", memberArray)
            if (error) {
                console.log(error)
            }
            else {
                if (members != null) {
                    //console.log(members)
                    setMembers(members.map(function(elem){
                          return elem.full_name;
                      }).join(", "));
                }
                else {
                    console.log("this error")
                }
            }

        }

    }

    return (
        <>
        
            

            {
                memberList.length > 1 && ( //read over responsive photo cards for CSS/HTML on card layout (photo goes on top)
                    <div class="card_groups">
                        <div>
                            <Link href={"/groups/" + id}><div style = {{textAlign: 'center', fontWeight: 'bold', fontSize: '15px'}} >{name}</div></Link>
                            <p>{description}</p> 

                        </div>

                        <div style = {{fontSize:'12px'}}>{memberList}</div>

                        </div>


                        )
                    }

               
            
           
            
                

            
        </>
    )
}