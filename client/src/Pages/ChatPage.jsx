import React, { useEffect } from 'react'

const ChatPage = () => {
    const getChats = async()=>{
          const chats = await fetch("http://localhost:5000/api/chats");
          const ChatData = await chats.json()
          console.log(ChatData)
    }
    useEffect(()=>{
        getChats()
    },[])
    
  return (
    <div>ChatPage</div>
  )
}

export default ChatPage