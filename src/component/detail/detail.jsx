import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import { useChatStore } from "../../lib/chatStore";
import { auth, db } from "../../lib/firebase";
import "./detail.css"
import { useUserStore } from "../../lib/userStore";
const Detail=()=>{
    const {currentUser}=useUserStore()
    const{ chatId,changeBlock, user, isCurrentUserBlocked,isReceiverBlocked, isLoading} =useChatStore()

    const handleblock=async ()=>{
   if(!user) return
   const userref=doc(db,"users",currentUser.id)
   try{
    await updateDoc(userref,{
        blocked:isReceiverBlocked?arrayRemove(user.id):arrayUnion(user.id),
    })
    changeBlock()
   }catch(user){
    console.log(err)
   }
    }
    return (
        <div className="detail">
            <div className="user">
                <img src={user?.avatar || "./avatar.png"} alt="" />
                <h2>{user?.username}</h2>
                <p>Lorem ipsum, dolor sit</p>

            </div>
            <div className="info">
            <div className="option">
    <div className="title">
     
        <span>
           Privacy and help
        </span>
        <img src="./arrowUp.png" alt="" />
    </div>
</div>
<div className="option">
    <div className="title">
     
        <span>
         chat setting
        </span>
        <img src="./arrowUp.png" alt="" />
    </div>
</div>

<div className="option">
    <div className="title">
      
        <span>
           Shared photo
        </span>
        <img src="./arrowDown.png" alt="" />
    </div> 
    <div className="photo">

    <div className="photoItem">
    <div className="photoDetail">
    <img src="./avatar.png" alt="" />
    <span>Name</span>
</div>
<img src="./download.png" alt="" className="icon"/>

    </div>
    <div className="photoItem">
    <div className="photoDetail">
    <img src="./avatar.png" alt="" />
    <span>Name</span>
</div>
<img src="./download.png" alt="" className="icon"/>
    </div>
</div>
</div>
<div className="option">
    <div className="title">
      
        <span>
            Shared files
        </span>
        <img src="./arrowUp.png" alt="" />
    </div>
</div>
<button onClick={handleblock}>{isCurrentUserBlocked ? "You Are Blocked": isReceiverBlocked? "User Blocked":"Block User"}</button>
<button className="logout" onClick={()=>auth.signOut()}>Logout</button>
            </div>
        </div>
    )
}
export default Detail;