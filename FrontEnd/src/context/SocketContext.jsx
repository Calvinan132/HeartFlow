import axios from "axios";
import { io } from "socket.io-client";
import { createContext, useEffect, useState, useContext } from "react";
import { AppContext } from "./AppContext";

export const SocketContext = createContext();
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const SocketContextProvider = (props) => {
  const { token, userData } = useContext(AppContext);

  const [messages, setMessages] = useState([]);
  const [receiverId, setReceiverId] = useState(null);
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [friends, setFriends] = useState([]);

  let loadFriends = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/friend/listfriend`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        setFriends(data.friends);
      } else {
        console.log("Lỗi gì đó!", data.message);
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (token) {
      loadFriends();
    }
  }, [token]);

  let loadOnlineUser = () => {
    if (!token || !userData || socket) return; // chỉ chạy khi có token và userData

    const sock = io(backendUrl, { auth: { token } });

    sock.on("connect", () => console.log("Connected:", sock.id));

    sock.on("receive_message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    sock.on("update_online_users", (users) => {
      setOnlineUsers(users);
      if (!receiverId) {
        const firstUser = users.find((id) => id !== userData?.id);
        if (firstUser) setReceiverId(firstUser);
      }
    });

    setSocket(sock);

    return () => {
      sock.disconnect();
      setSocket(null);
    };
  };
  // Load tin nhắn cũ khi chọn receiver
  let loadMessage = () => {
    if (!receiverId || !userData.id) return;
    const fetchMessages = async () => {
      try {
        console.log(`${userData.id}/${receiverId}`);
        const res = await axios.get(
          `${backendUrl}/api/user/${userData.id}/${receiverId}`
        );
        console.log(res);
        setMessages(res.data);
      } catch (err) {
        console.error("Lỗi fetch messages:", err);
      }
    };

    fetchMessages();
  };
  useEffect(loadMessage, [receiverId, userData]);

  useEffect(loadOnlineUser, [token, userData]);

  const value = {
    messages,
    setMessages,
    receiverId,
    setReceiverId,
    socket,
    setSocket,
    onlineUsers,
    setOnlineUsers,
    loadFriends,
    friends,
    setFriends,
  };
  return (
    <SocketContext.Provider value={value}>
      {props.children}
    </SocketContext.Provider>
  );
};

export default SocketContextProvider;
