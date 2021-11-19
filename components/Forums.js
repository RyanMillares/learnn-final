import ForumItem from "../components/ForumItem"

import { useEffect, useState } from 'react'
import Input from "../components/Input"

import { supabase } from '../utils/supabaseClient'

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
            return -1; //you really messed up
            
    }
}
function monthToNum2(month) { //this is slower
    let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]; 
    return months.indexOf(month);

}



function compare(a, b) {

    const bandA = a.date_sent;
    const bandB = b.date_sent;
  
    let comparison = 0;
    if (bandA > bandB) {
      comparison = 1;
    } else if (bandA < bandB) {
      comparison = -1;
    }
    return comparison;
  }
export default function Forums ({user}) {
    const [completelyUselessString, setUseless] = useState()
    const testNam = supabase.auth.user()

    const currentName = "rmillares" //this is default, idk how to carry over username yet
    const badWords = [" kill ", " bad ", "murder"]
    var testDate = new Date().getTime()

    const [forumTests, setForumTests] = useState([])
    const [error, setError] = useState(null)
    const [isSame, setSame] = useState([])

    useEffect(() => {
        fetchMessages()

    })
    const fetchMessages = async () => {
        let { data: messages, error} = await supabase
        .from("chattests")
        .select()
        messages.sort(compare)
        if(!messages == null) {
            

        }
        
        if(!error) {
            setForumTests(messages)
        }
        else {
            console.log(error)
        }
        


    }

    const addMessage = async (msg) => {
        let flag1 = true
        let currWord = ""
        if(msg.length == 0) {
            flag1 = false
        }
        else {
            for (let i = 0; i < badWords.length; i++) {
                if (msg.includes(badWords[i])) {
                  flag1 = false
                  currWord = badWords[i]
                }
              }
        }
        

        
        if(flag1) {
            //console.log("reached")
            let brandNewDate = new Date().getTime()
            const { data, error } = await supabase
                .from("chattests")
                .insert([
                { sender: testNam.email, date_sent: brandNewDate, message: msg}])
                console.log(testNam.email)
            if(!error) {
                setForumTests([...forumTests, {'sender': testNam.email, 'date_sent': brandNewDate, 'message': msg}])
                console.log("Success")
            }
            else {
                console.log(error)
            }
            
            console.log(brandNewDate)
        }
        else {
            alert("Your message:\n\n" + msg + "\n\ncontained the word [" + currWord + "], which is not allowed, thus your message failed to send.")
        }

    }


   
    return (
        <div>
            <div class = "forumEnter">
                {
                    false && (
                        <h1 style = {{fontSize: '32'}}>Forums</h1>
                    )
                }
                
                
               
            </div>

            <div id = "forumPage" class = "forumPage">
             

                
                <div id = "forums" className = "forums">
                    {
                        //forumTests.slice(0).reverse().map((forum) => (
                    forumTests.map((forum, i) => (
                    
                    <ForumItem sender = {forum.sender} date_sent = {forum.date_sent} message = {forum.message} msgId = {forum.chat_id} table = "chattests" updater = {fetchMessages} isNew = {i > 0 ? forumTests[i].sender != forumTests[i - 1].sender : true}
                    newDay = {i > 0 ? String(new Date(forumTests[i].date_sent)).slice(8,10) != String(new Date(forumTests[i - 1].date_sent)).slice(8,10) : true} />
                    ))
                    }
                    
                </div>
                
            </div>
            <div class = "forumEnter">
            <Input handleSubmit = {addMessage} buttonText = "Send"/>

            </div>
        </div>
    )
}