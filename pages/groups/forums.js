import ForumItem from "../../components/ForumItem"
import Header from "../../components/Header"
import { useEffect, useState } from 'react'
import Input from "../../components/Input"

import { supabase } from '../../utils/supabaseClient'

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

export default function forums () {
    //const { name } = Auth.useUser()
    //console.log(name.user)
    //const currentName = "rmillares" //this is default, idk how to carry over username yet
    
    const testBool = true
    let user = supabase.auth.user()
    if(user == null) {
        user =  supabase.auth.user()
    }
    
    
    const badWords = [" kill ", "suicide", "murder"]

    const [forumTests, setForumTests] = useState([])

    const [error, setError] = useState(null)
    const [lastUser, setLastUser] = useState("")
    const [isSame, setSame] = useState([])


    useEffect(() => {
        fetchMessages()
    })
    const fetchMessages = async () => {
        //fetch sql data
        let { data: messages, error} = await supabase
        .from("chat")
        .select()
        
        if(messages != null) {
          
            messages.sort(compare)
        }

        if(!error) {
            
            setForumTests(messages)
        }
        else {
            console.log(error)
        }
        //create array of bools checking whether msg is sent by new user
        
        //let isSameUser = []
        //let lastUser = ""
        //for(let i = 0; i < forumTests.length; i++) {
        //    if(forumTests[[i]].sender === lastUser) {
        //        isSameUser.push(false)
        //    }
        //    else {
        //        isSameUser.push(true)
        //    }
        //    lastUser = forumTests[i].sender
       // }
        //merge arrays
        //var newForums = forumTests.map(function(e, i) {
        //    return [e, isSameUser[i]]
        //})        
    
        //console.log(newForums)
        //setForumTests(newForums)
        //setSame(isSameUser)
    }

    const addMessage = async (msg) => {
        let errorCode = 0 //0 = fine, 1 = blacklisted word, 2 = only white-space
        let flag1 = true
        let currWord = ""
        if(msg.length == 0 || !(msg.trim().length)) { // thanks https://stackoverflow.com/questions/17524290/how-to-check-for-string-having-only-spaces-in-javascript
            flag1 = false
            errorCode = 2
        }
        else {
            for (let i = 0; i < badWords.length; i++) {
                if (msg.includes(badWords[i])) {
                  flag1 = false
                  currWord = badWords[i]
                  errorCode = 1
                  break
                }
              }
        }

        
        if(flag1) {
            //console.log("reached")
            let brandNewDate = new Date().getTime()
            const { data, error } = await supabase
                .from("chat")
                .insert([
                { sender: user.email, date_sent: brandNewDate, message: msg}])
            if(!error) {
                setForumTests([...forumTests, {'sender': user.email, 'date_sent': brandNewDate, 'message': msg}])
            }
            else {
                console.log(error)
            }
            
            console.log(brandNewDate)
        }
        else {
            switch (errorCode) {
                case 1: 
                alert("Your message:\n\n" + msg + "\n\ncontained the word [" + currWord + "], which is not allowed, thus your message failed to send.")
                break
                case 2:
                alert("Your message is either blank or contains only white-space. Please ensure your message is an actual message. ;)")
            }
        }
        const theElement = document.getElementById('forumPage');

        const scrollToBottom = (node) => {
            node.scrollTop = node.scrollHeight;
        }

        scrollToBottom(theElement);
        

    }
    //let lmaoo = new Date().getTime()
        //console.log(String(new Date(lmaoo)).slice(8,10))
    

   
    return (
        <div>
        <Header/>
        {
            user != null && (
                <h1 className = "text-center font-bold">Welcome {(user.email).split("@")[0]}</h1>
            )
        }
       

        <div class = "forumEnter">
            {
                false && (
                    <h1 style = {{fontSize: '32'}}>Forums</h1>
                )
            }
            
            
           
        </div>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
                <div id="forumPage" class="forumPage">



                    <div id="forums" className="forums">
                        {
                            forumTests.length > 0 && (
                                forumTests.map((forum, i) => (


                                    (forum != null) && (
                                        <ForumItem 
                                        sender={forum.sender} 
                                        date_sent={forum.date_sent} 
                                        message={forum.message} 
                                        msgId={forum.chat_id} 
                                        table="chat" 
                                        updater={fetchMessages} 
                                        isNew={i > 0 ? (forumTests[i].sender != forumTests[i - 1].sender || (forumTests[i].date_sent - forumTests[i - 1].date_sent > 3600000) && forumTests[i].sender == forumTests[i - 1].sender) : true
                                        
                                        }
                                        newDay = {i > 0 ? String(new Date(forumTests[i].date_sent)).slice(8,10) != String(new Date(forumTests[i - 1].date_sent)).slice(8,10) : true} />
                                    ))
                                )

                            )
                            //forumTests.slice(0).reverse().map((forum) => (

                        }



                    </div>

                </div>
                <div style = {{width: '40vw'}}>
                    <h1>lmao</h1>
                </div>
            </div>
       
        <script>
            
        </script>
        <div class = "forumEnter">
        <Input handleSubmit = {addMessage} buttonText = "Send"/>

        </div>
    </div>
    )
}