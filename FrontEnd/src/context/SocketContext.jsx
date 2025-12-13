import axios from "axios";
import { io } from "socket.io-client";
import {
  createContext,
  useEffect,
  useState,
  useContext,
  useCallback,
} from "react";
import { AppContext } from "./AppContext";

export const SocketContext = createContext();
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const SocketContextProvider = (props) => {
  const { token, userData } = useContext(AppContext);

  const [messages, setMessages] = useState([]);
  const [receiverId, setReceiverId] = useState(null);
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [notification, setNotification] = useState([]);

  useEffect(() => {
    if (!token || !userData) return;

    const sock = io(backendUrl, { auth: { token } });

    sock.on("connect", () => console.log("Socket Connected:", sock.id));

    sock.on("receive_message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    sock.on("update_online_users", (users) => {
      setOnlineUsers(users);
    });

    sock.on("newNotification", (data) => {
      setNotification((prev) => [data, ...prev]);
    });

    setSocket(sock);

    // Hàm Cleanup: Rất quan trọng
    return () => {
      sock.disconnect();
      setSocket(null);
      console.log("Socket Disconnected");
    };
  }, [token, userData]);

  useEffect(() => {
    if (!receiverId || !userData?.id) {
      setMessages([]);
      return;
    }

    const controller = new AbortController();

    const fetchMessages = async () => {
      try {
        const res = await axios.get(
          `${backendUrl}/api/user/${userData.id}/${receiverId}`,
          { signal: controller.signal }
        );
        setMessages(res.data);
      } catch (err) {
        if (err.name === "CanceledError") {
          console.log("Request tải tin nhắn cũ đã bị hủy.");
        } else {
          console.error("Lỗi fetch messages:", err);
        }
      }
    };

    fetchMessages();

    return () => {
      controller.abort();
    };
  }, [receiverId, userData?.id]);

  const getNotification = useCallback(async () => {
    if (!token) return;
    try {
      let { data } = await axios.get(backendUrl + "/api/user/getnotification", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        setNotification(data.data);
      } else {
        console.log("Lỗi dữ liệu");
      }
    } catch (e) {
      console.log("Lỗi từ frontend :", e.message);
    }
  }, [token]);

  useEffect(() => {
    getNotification();
  }, [getNotification]);

  const value = {
    messages,
    setMessages,
    receiverId,
    setReceiverId,
    socket,
    setSocket,
    onlineUsers,
    setOnlineUsers,
    notification,
  };
  return (
    <SocketContext.Provider value={value}>
      {props.children}
    </SocketContext.Provider>
  );
};

export default SocketContextProvider;
