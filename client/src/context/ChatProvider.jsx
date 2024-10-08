import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [selectedChat, setselectedChat] = useState();
  const [chats, setChats] = useState([]);
  const [notification, setNotification] = useState([]);

  const Navigate = useNavigate();
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setUser(userInfo);
    if (!userInfo) {
      Navigate("/");
    }
  }, [Navigate]);
  return (
    <ChatContext.Provider
      value={{
        user,
        setUser,
        selectedChat,
        setselectedChat,
        notification,
        setNotification,
        chats,
        setChats,
      }}>
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;
