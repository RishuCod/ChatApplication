import { useState } from "react"
import "./login.css"
import { toast } from "react-toastify"
import { createUserWithEmailAndPassword,signInWithEmailAndPassword} from "firebase/auth"
import { auth,db } from "../../lib/firebase"
import { setDoc,doc } from "firebase/firestore"
import upload from "../../lib/upload"
const Login = ()=>{
    const [avatar,setSAvatar]=useState({
        file:null,
        url:""
    })
const [loading,setloading]=useState(false)
 const handleAvatar=(e)=>{
    setSAvatar({
        file:e.target.files[0],
        url:URL.createObjectURL(e.target.files[0])
    })
 }

 const handlelogin =async (e)=>{
    e.preventDefault()
    setloading(true)  
    const formData =new FormData(e.target)
        const {email,password}=Object.fromEntries(formData)
    try{
      await signInWithEmailAndPassword(auth,email,password)

    
    }catch(err){
        toast.error("error")
    }finally{
        setloading(false)
    }

 }

 const handleRegister =async (e)=>{
    e.preventDefault()
    setloading(true)
    const formData =new FormData(e.target)
    const {username,email,password}=Object.fromEntries(formData)

 
 try{
    const res=await createUserWithEmailAndPassword(auth,email,password)
    const imgUrl=await upload(avatar.file)
    await setDoc(doc(db,"users",res.user.uid),{
        username,
        email,
        avatar:imgUrl,
        id:res.user.uid,
        blocked:[]
    });

    await setDoc(doc(db,"userchats",res.user.uid),{
      chats:[]
    });

    toast.success("account made")
}catch(err){
console.log(err)
 }
 finally{
    setloading(false)
 }
}
    return (
        <div className="login">
            <div className="item">
                <h2>welcome</h2>
                <form action="" onSubmit={handlelogin}>
                    <input type="text" placeholder="email" name="email"/>
                    <input type="password"  placeholder="password" name="password"/>
            <button disabled={loading}>{loading?"loading..." :"Sign in"}</button>
                </form>
            </div>
            <div className="separator"></div>
            <div className="item">
            <h2>Make an account</h2>
            <form action="" onSubmit={handleRegister}>
                <label htmlFor="file">
                <img src={avatar.url || "./avatar.png"} alt="" />upload an image</label>
                <input type="file" id="file" style={{display:"none"}} onChange={handleAvatar}/>
                    <input type="text" placeholder="usename" name="username"/>
                    <input type="text" placeholder="email" name="email"/>

                    <input type="password"  placeholder="password" name="password"/>
            <button disabled={loading}>{loading?"loading..." :"Make an account"}</button>
                </form>
            </div>
        </div>
    )
}
export default Login