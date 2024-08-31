import { addDoc, arrayUnion, collection, doc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore";
import "./addUser.css"
import { useState } from "react";
import { db } from "../../../../lib/firebase";
import { useUserStore } from "../../../../lib/userStore";
const AddUser=()=>{
const [user,setUser] = useState(null)
const {currentUser} = useUserStore()
    const handleSearch=async (e)=>{
        e.preventDefault()
        const formdata=new FormData(e.target);
       const username = formdata.get("username")
     try{
        const userRef = collection(db, "users");
        
        const q = query(userRef, where("username", "==", username));
        const querySnapShot = await getDocs(q);
        if(!querySnapShot.empty){
            setUser(querySnapShot.docs[0].data())
        }
     }  catch(err){
console.log(err)
     }
    }

    const handleadd =async (e)=>{
        const chatref=collection(db,"chats")
        const userchatref=collection(db,"userchats")
    
        try{
            const newchatref=doc(chatref)
            await setDoc(newchatref,{
                createdAt:serverTimestamp(),
                messages:[]
            });
            await updateDoc(doc(userchatref,user.id),{
                chats:arrayUnion({
                    chatId:newchatref.id,
                    lastMessage:"",
                    receiverId:currentUser.id,
                    updatedAt:Date.now(),
                    
                }) 
            })

            await updateDoc(doc(userchatref,currentUser.id),{
                chats:arrayUnion({
                    chatId:newchatref.id,
                    lastMessage:"",
                    receiverId:user.id,
                    updatedAt:Date.now()
                }) 
            })
        }catch(err){
            console.log(err)
        }

    }
    return(
        <div className="adduser">
            <form action="" onSubmit={handleSearch}>
                <input type="text" placeholder="username" name="username"/>
                <button>search</button> </form>
               {user && <div className="user">
                    <div className="detail">
                        <img src={user.avatar || "./avatar.png"} alt="" />
                        <span>{user.username}</span>
                    </div>
                    <button onClick={handleadd}>add user</button>
                </div>}
           
        </div>
    )
}
export default AddUser