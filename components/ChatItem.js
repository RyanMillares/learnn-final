import { supabase } from '../utils/supabaseClient'
import { useEffect, useState } from 'react';
import Image from 'next/image'

function monthToNum1(month) { //this is faster
    switch (month) {
        case "Jan":
            return 1;    
        case "Feb":
            return 2;
        case "Mar":
            return 3;
        case "Apr":
            return 4;
        case "May":
            return 5;
        case "Jun":
            return 6;
        case "Jul":
            return 7;
        case "Aug":
            return 8;
        case "Sep":
            return 9;
        case "Oct":
            return 10;
        case "Nov":
            return 11;
        case "Dec":
            return 12;
        default: 
            return -1; //you really messed up /
            
    }
}

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


function msgAligns(currUser, name) {
    let isMine = (currUser.email == name)
    
    let msgAlign = (isMine ? "left" : "right")
    let buttonAlign = (isMine ? "right" : "left")
    return {msgAlign, buttonAlign}

}

export default function ChatItem({ sender, date_sent, message, msgId, table, updater, isNew, newDay }) {
    const [msgSettings, setSettings] = useState(false)
    const [editMode, setEditMode] = useState(false)
    const [editted, setEditted] = useState(false)
    const [value, setValue] = useState  (message)
    const [Avatar, setAvatarUrl] = useState(null)
    const [userInfo, setInfo] = useState(null)
    const [blob, setBlob] = useState(null)
    const [fetching, setFetching] = useState(false)
    useEffect(() => {
        if(userInfo == null && (isNew || newDay)) {
            fetchAvatarUrl(sender)
            
        }
        else {
            if(blob == null && (isNew || newDay)) {
                downloadImage(userInfo.avatar_url)
            }   
            
        }
        
    })
    async function downloadImage(path) {
        console.log(path)
        try {
          const { data, error } = await supabase.storage.from('avatars').download(path)
          if (error) {
            //throw error
            console.log(error)
          }
          const url = URL.createObjectURL(data)
          //console.log(url)

          setBlob (url)
          
        } catch (error) {
          console.log('Error downloading image: ', error.message)
          setBlob ("../images/default.jpg")

        }
      }
      async function fetchAvatarUrl(sender) {
          
              const {data, error} = await supabase
              .from("profiles")
              .select()
              .eq("email", sender)
              if(error) {
                  console.log(error)
                  setAvatarUrl("default.jpg")
              }
              else {
                  console.log(data[0].avatar_url)
                setInfo(data[0])
                setFetching(true)
              }
              

          
      }
      //fetchAvatarUrl(sender)
    const deleteMessage = async () => {
        let { data: messages, error} = await supabase
            .from(table)
            .delete()
            .match({msg_id: msgId})
    
        if(!error) {
            
            console.log("reached")
        }
        else {
            console.log(error)
        }
    }
    const updateMessage = async (newMsg) => {
        console.log(msgId)
        const { data, error } = await supabase
            .from(table)
            .update({ message: newMsg })
            .match({ msg_id: msgId})
        if(error) {
            console.log(error) 
        }
        else {
            
        }
    }

    const currUser = supabase.auth.user()
    let newTime = String(new Date(date_sent)).slice(16,21)
    const finalTime = convertedTime(newTime)

    

    let newDate = String(new Date(date_sent)).slice(4,15)
    let formattedDate = convertedDate(newDate)
    let name = ""
    if (sender == null) {
        name = "[Unknown User]"
    }
    else {
        name = String(sender)
    }
    let alignItems = msgAligns(currUser, name)
    let userEmail = name.split("@");
    let userName = userEmail[0]


    let editMsg = e => {
        e.preventDefault()
        updateMessage(value)
        setEditMode(false)
        setValue(message)
    }
    //console.log(name == lastPoster)
    //setLastPoster(name)
    //document.addEventListener("contextmenu", (event) => {event.preventDefault()});
    //console.log(Avatar)
    






    return (
        
            <div className = "forumItem" style = {{backgroundColor: editMode ? "#c6ecc6" : ""}}> 
                {
                    (newDay) && (
                        <h1 className = "responsive_text2" style = {{textAlign: 'center', fontStyle: 'italic', fontWeight: 'bold'}}> {formattedDate} </h1>
                    )
                }
            {
                
                (isNew || newDay) && (
                    <h1 style={{ textAlign: currUser.email == name ? 'right' : 'left' }}>
                        {
                            currUser.email != name && (
                                <img src= {blob != null ? blob : "../images/default.jpg"} className = "responsive_chatImg" style={{borderRadius: '100%', overflow: 'hidden', display: 'inline' }} />
                            )
                        }

                        {
                            currUser.email == name && (
                                <i className = "responsive_text3">&nbsp;Sent&nbsp;{formattedDate} {finalTime.convTime} {
                                    finalTime.isPM ? (
                                        "PM"
                                    ) : (
                                        "AM"
                                    )
                                }</i>
                            )
                        } { userInfo != null && (
                            <a className = "responsive_text2">
                                {userInfo.full_name}
                            </a>
                            )
                            } {
                            currUser.email != name && (
                                <i className = "responsive_text3"> Sent {formattedDate} {finalTime.convTime} {
                                    finalTime.isPM ? (
                                        "PM"
                                    ) : (
                                        "AM"
                                    )
                                }</i>
                            )
                        }
                        {
                            currUser.email == name && ( //add function later to fetch this
                                <img src={blob != null ? blob : "../images/default.jpg"} className = "responsive_chatImg" style={{borderRadius: '100%', overflow: 'hidden', display: 'inline' }} />
                            )
                        }
                    </h1>
                )
            }         
              
                <p style = {{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}> 
                {
                    (currUser.email == name) && ( //currUser.email == name
                        (msgSettings) ? (
                            <> 
                                { // --> FIND way to keep text on right when hidden
                                    !editMode ? (
                                        <span style={{ color: 'white', float: 'left', display: 'flex', flexDirection: 'column', marginBottom: '0px' }}>
                                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly' }}>
                                    
                                    
                                    <button type="submit" id="delete" className="bg-red-300 rounded px-4 py-0.25 text-black" onClick={() => {
                                        if(confirm("Are you sure you want to delete your message: \n\n\"" + message + "\"\n\nThis action cannot be undone.")) {
                                            deleteMessage()

                                        }
                                        else {
                                            setSettings(false)
                                        }
                                    }

                                    }>Delete</button>
                                    <i> </i>
                                    <button type="submit" id="edit" className="bg-blue-300 rounded px-4 py-0.25 text-black" onClick={() => {
                                        setEditMode(true)

                                    }}>Edit</button>

                                </div>
                            </span>
                                    ) : (
                                        <span style = {{float: 'left'}}>
                                            &nbsp;
                                        </span>
                                    )
                                }
                            
                            </>
                        ) : (
                            <div> </div>
                        )

                    )}

                    {
                        ////textAlign: 'alignItems.msgAlign'
                        editMode ? (
                            <>
                            <form className="flex flex-col" onSubmit={editMsg}>
                                <textarea id="editMsg" className="rounded px-3 py-2" style={{ fontSize: '14px', height: 'auto', backgroundColor: '#DDEEFF', color: 'black', borderRadius: '5px', border: '2px solid #5577AA', width: '35vw' }} value={value} onChange={(e) => setValue(e.target.value)} />
                                <div className="flex flex-row items-center justify-center" style = {{color: 'black'}}>
                                    <button type="cancel" id="cancel" className="bg-red-300 rounded px-4 py-0.25" style={{ marginLeft: '1px', marginRight: '1px' }} onClick={() => {
                                        setEditMode(false)
                                        setSettings(false)

                                    }
                                    }>Cancel</button>

                                    <button type="submit" id="submit" className="bg-green-300 rounded px-4 py-0.25" style={{ marginLeft: '1px', marginRight: '1px' }} onClick={() => {
                                        setSettings(false)
                                    }
                                    }>Confirm</button>
                                </div>


                            </form>
                            
                            </>
                            
                        ) : (
                            <>
                            
                            <div className = "forumMessage" style = {{backgroundColor: currUser.email == name ? '#003377' : 'dimgray', color: currUser.email == name ? 'white' : 'white', cursor: currUser.email == name ? 'pointer' : ''}} onClick = {() => {
                                if(!editMode) {
                                    setSettings(!msgSettings)

                                }
                            }}>
                                
                                {message}
                                </div>
                            </>
                        )
                    }
                    
  
                </p>
               
            </div>

    )
}