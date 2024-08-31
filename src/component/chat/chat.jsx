import { useEffect, useRef, useState } from "react";
import "./chat.css"
import EmojiPicker from "emoji-picker-react";
import { arrayUnion, doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useChatStore } from "../../lib/chatStore";
import { useUserStore } from "../../lib/userStore";
import upload from "../../lib/upload";
const Chat=()=>{
    const [open,setOpen]=useState(false)
    const [text,setText]=useState("")
    const [img,setImg]=useState({
        file:null,
        url:""
    })
    const [chat,setChat]=useState([])
    const {chatId,user, isCurrentUserBlocked,isReceiverBlocked}= useChatStore()
    const {currentUser}= useUserStore()
    const endref = useRef(null)
    useEffect(()=>{
        endref.current?.scrollIntoView({behavior:"smooth"})
    })
    const handleEmoji=(e)=>{
setText((prev)=>prev +e.emoji);
setOpen(false)
    }

    const handleImg=(e)=>{
        setImg({
            file:e.target.files[0],
            url:URL.createObjectURL(e.target.files[0])
        })
     }
const handleSend=async (e)=>
{
    let imgUrl=null;
    if(text==="") return;
    try{
        if(img.file){
            imgUrl= await upload(img.file);
        }
        await updateDoc(doc(db,"chats",chatId),{
            messages:arrayUnion({
                senderId:currentUser.id,
                text,
                createdAt:new Date(),
                ...(imgUrl && {img:imgUrl})
            }),
            
        });

     const userIDs=[currentUser.id,user.id]   
     userIDs.forEach(async (id)=>{
const userChatRef=doc(db,"userchats",id)
const userChatsSnapshot=await getDoc(userChatRef)
if(userChatsSnapshot.exists()){
    const userChatsData=userChatsSnapshot.data()
    const chatIndex =userChatsData.chats.findIndex((c)=>c.chatId==chatId)
    userChatsData.chats[chatIndex].lastMessage=text;
    userChatsData.chats[chatIndex].isSeen=id===currentUser.id?true:false;
    userChatsData.chats[chatIndex].updatedAt=Date.now();
    await updateDoc(userChatRef,{
        chats:userChatsData.chats,

    })
}})
    }catch(err){
        console.log(err);
    }
    setImg({
        file:null,url:""
    })
    setText("")
}



useEffect(()=>{
const unsub=onSnapshot(doc(db,"chats",chatId),(res)=>{
setChat(res.data())
})
return ()=>{
    unsub()
}

},[chatId])


    return (
        <div className="chat">
            <div className="top">
                <div className="userb">
                    <img src={user?.avatar || "./avatar.png"} alt="" />
                    <div className="texts">
                        <span>{user?.username}</span>
                        <p>Lorem ipsum dolor sit amet consectetur.</p>
                    </div>
                </div>
                <div className="icons">
<img src="./phone.png" alt="" />
<img src="./video.png" alt="" />
<img src="./info.png" alt="" />
                </div>
            </div>
            <div className="center">

  
            {chat?.messages?.map((message)=>(
                <div className={message.senderId===currentUser.id?"message own" :"message" }key={message?.createAt}>
    <img src="./avatar.png" alt ="" />
    <div className="texts">
       {message.img && <img src={message.img} alt="" />}
        <p>{message.text}</p>
<span>1 min ago</span>
    </div></div>))}
{img.url && <div className="message own">
    <div className="texts">
        <img src={img.url} alt="" />
    </div>
</div>}
<div ref={endref}></div>
            </div>
            <div className="bottom">
                <div className="icons">
                   <label htmlFor="file"><img src="./img.png" alt="" /></label> 
                    <input type="file" id="file" style={{display:"none"}} onClick={handleImg}/>
                    <img src="./camera.png" alt="" />
                    <img src="./mic.png" alt="" />
                </div>
                <input value={text} type="text" placeholder={(isCurrentUserBlocked || isReceiverBlocked)? "You cannot send the message":"mesaage...."} onChange={(e)=>setText(e.target.value)} disabled={isCurrentUserBlocked||isReceiverBlocked}/>
            <div className="emoji">
                <img src="./emoji.png" alt="" onClick={()=> setOpen(!open)}/>
<div className="picker">
<EmojiPicker open={open}  onEmojiClick={handleEmoji} />
</div>
            </div>
            <button className="sendButton" onClick={handleSend} disabled={isCurrentUserBlocked||isReceiverBlocked}>Send</button>
            </div>
        </div>
    )
}
export default Chat;