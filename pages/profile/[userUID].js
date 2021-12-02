import Header from "../../components/Header"
import { useEffect, useState } from 'react'
import { useRouter } from "next/dist/client/router"

import { supabase } from '../../utils/supabaseClient'
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
export default function userProfile() {

    let user = supabase.auth.user()
    if(user == null) {
        user =  supabase.auth.user()
    }
    const router = useRouter()
    const userId = router.query.userUID
    const [userInfo, setInfo] = useState([])
    const [validUser, setValid] = useState(0)

    useEffect(() => {
        if(validUser == 0) {
            fetchUserInfo()

        }
        console.log(userId)
    })
    const fetchUserInfo = async () => {
        const {data, error} = await supabase
        .from("profiles")
        .select()
        .eq("id", userId)
        if(error) {
            console.log(error)
        }
        else {
            if(data != null)
                setValid(data.length == 1 ? 2 : 1)
                setInfo(data[0])
            
        }
    }


    return (
        <>
            <Header/>
            {
                validUser == 0 ? (
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
                            validUser == 1 ? (
                                <>
                                <h1 className="text-center font-bold text-3xl">This user does not exist.</h1>
                                {
                                    setTimeout(() => {  router.push("https://www.youtube.com/watch?v=dQw4w9WgXcQ") }, 2000)
                                }
                                </>
                                
                            ) : (
                                
                                <>
                                {
                                    userInfo != null && (
                                        <>
                                        <h1 className = "text-center font-bold text-3xl">This is the user {userInfo.full_name}</h1>
                                <h1 className = "text-center font-bold text-3xl">Email: {userInfo.email}</h1>
                                <h1 className = "text-center font-bold text-3xl">School: {userInfo.school}</h1>
                                <h1 className = "text-center font-bold text-3xl">Join Date: {String(new Date(new Date(userInfo.created_at).getTime())).slice(4, 15)} {convertedTime(String(new Date(new Date(userInfo.created_at).getTime())).slice(16, 21)).convTime} {convertedTime(String(new Date(new Date(userInfo.created_at).getTime())).slice(16, 21)).isPM ? "PM" : "AM"} </h1>
                                        </>
                                    )
                                }
                                
                                </>
                            )
                        }
                    </>
                )
            }


        </>
    )
}