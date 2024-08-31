import './index.css';
import Chat from "./component/chat/chat";
import Detail from "./component/detail/detail"
import List from "./component/list/list"
import Login from "./component/login/login"
import Notification from './component/notification/notification';
import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './lib/firebase';
import {useUserStore} from './lib/userStore'
import { useChatStore } from './lib/chatStore';
const App = () => {
  const {currentUser,isLoading,fetchUserInfo} = useUserStore()
  const {chatId} =useChatStore()
  useEffect(()=>{
    const unSub=onAuthStateChanged(auth,(user)=>{
   fetchUserInfo(user?.uid);
    })
    return ()=>{
      unSub();
    }
  },[fetchUserInfo])
if(isLoading) return <div className="loading">loading...</div>

  return (
    <div className='container'>
      {
        currentUser ?
         <>
        <List />
         {chatId && <Chat />}
         {chatId && <Detail />}
          </> :(
          <Login />)
      }
        <Notification />
    </div>
  )
}

export default App