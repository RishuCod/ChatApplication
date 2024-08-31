import { useEffect, useState } from "react";
import "./clist.css"
import AddUser from "./addUser/addUser";
import { useUserStore } from "../../../lib/userStore";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { useChatStore } from "../../../lib/chatStore";
const Clist=()=>{
    const [more,setmore]=useState(false);
    const[chats,setChats] =useState([]);
    const[input,setinput] =useState("");
    const {currentUser}= useUserStore()
    const {chatId,changeChat}= useChatStore()
    useEffect(()=>{
        const unsub = onSnapshot(doc(db, "userchats", currentUser.id),async (res) => {
           const items=res.data().chats;
           const promises=items.map(async (item)=>{
            const userDocRef =doc(db,"users",item.receiverId)
             const userDocSnap=await getDoc(userDocRef);
             const user=userDocSnap.data();
             return {...item,user};

           })
           const chatData=await Promise.all(promises);
           setChats(chatData.sort((a,b)=>b.updatedAt-a.updatedAt))
        });

        return ()=>{
            unsub()
        }
    },[currentUser.id])
const filterchats=chats.filter((c)=>c.user.username.toLowerCase().includes(input.toLowerCase()))
    const handleSelect=async (chat)=>{
        const userchats=chats.map((item)=>{
            const {user,...rest}=item;
            return rest;
        })
        
        const chatIndex = userchats.findIndex(item=>item.chatId===chat.chatId)
        userchats[chatIndex].isSeen=true;
        const userchatref=doc(db,"userchats",currentUser.id);
        try{
            await updateDoc(userchatref,{
                chats:userchats
            })
            changeChat(chat.chatId,chat.user)
        }catch(err){
            console.log(err)
        }


 changeChat(chat.chatId,chat.user)
    } 
    return (
        <div className="clist">
            <div className="search">
                <div className="searchBar">
                    <img src="./search.png"  alt=""/>
                    <input type="text" placeholder="Search" onChange={(e)=>setinput(e.target.value)}/>
                </div>
                <img src={more?"./minus.png": "./plus.png"} className="more" onClick={()=> setmore((prev)=> !prev)}/>
            </div>

            
            {filterchats.map((chat)=>(
    <div className="item" key={chat.chatId} onClick={()=>handleSelect(chat)} style={{backgroundColor:chat?.isSeen ? "transparent" : "blue"}}>
    <img src={chat.user.blocked.includes(currentUser.id)?"/avatar.png":chat.user.avatar ||"./avatar.png"} alt="" />
    <div className="texts">

    <span>{chat.user.blocked.includes(currentUser.id)?"User":chat.user.username}</span>
    <p>{chat.lastMessage}</p>
    </div>

    </div>
            ))}
           
       {more &&<AddUser />}
        </div>
    )
}
export default Clist;