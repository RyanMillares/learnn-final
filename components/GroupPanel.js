import { useEffect, useState } from "react"
import { supabase } from "../utils/supabaseClient"
import Link from "next/link"

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
                            <Link href={"/groups/" + id}><div className = "responsive_text2" style = {{textAlign: 'center', fontWeight: 'bold'}} >{name}</div></Link>
                            <p className = "responsive_text4">{description}</p> 

                        </div>

                        <div className = "responsive_text3">{memberList}</div>

                        </div>


                        )
                    }

               
            
           
            
                

            
        </>
    )
}