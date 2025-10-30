import axios from "axios";
import { io } from "socket.io-client";
import {
  createContext,
  useEffect,
  useState,
  useContext,
  useCallback, // Thêm useCallback
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
  const [friends, setFriends] = useState([]);
  const [rq, setrq] = useState([]);

  // ----------------------------------------------------------------
  // SỬA LỖI SỐ 3: Dùng useCallback
  // ----------------------------------------------------------------
  const loadFriends = useCallback(async () => {
    // Thêm guard clause
    if (!token) return;
    try {
      const { data } = await axios.get(`${backendUrl}/api/friend/listfriend`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        setFriends(data.friends);
      } else {
        console.log("Lỗi tải bạn bè!", data.message);
      }
    } catch (e) {
      console.log(e);
    }
  }, [token]); // Chỉ chạy lại khi token thay đổi

  useEffect(() => {
    loadFriends();
  }, [loadFriends]); // Giờ đây ta dùng hàm đã useCallback

  // ----------------------------------------------------------------
  // SỬA LỖI SỐ 1: Khởi tạo Socket.IO
  // Logic của `loadOnlineUser` được chuyển trực tiếp vào đây
  // ----------------------------------------------------------------
  useEffect(() => {
    // Guard clause: Chỉ chạy khi có token và userData
    if (!token || !userData) return;

    // `socket` đã tồn tại, không cần tạo mới
    // (Lưu ý: code gốc của bạn có `!socket`, logic này có thể cần xem lại
    // nếu bạn muốn kết nối lại khi token thay đổi, nhưng hiện tại ta giữ logic cũ)

    // Khởi tạo kết nối
    const sock = io(backendUrl, { auth: { token } });

    sock.on("connect", () => console.log("Socket Connected:", sock.id));

    sock.on("receive_message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    sock.on("update_online_users", (users) => {
      setOnlineUsers(users);

      // Cập nhật logic: Ưu tiên set receiverId là partner nếu họ online
      setReceiverId((currentReceiver) => {
        // Nếu đã có người chat, giữ nguyên
        if (currentReceiver) return currentReceiver;

        // Nếu partner có trong danh sách online, chọn partner
        if (userData.partner && users.includes(userData.partner)) {
          return userData.partner;
        }

        // Nếu không, chọn người đầu tiên không phải là mình
        const firstUser = users.find((id) => id !== userData?.id);
        return firstUser || null;
      });
    });

    setSocket(sock);

    // Hàm Cleanup: Rất quan trọng
    return () => {
      sock.disconnect();
      setSocket(null);
      console.log("Socket Disconnected");
    };
  }, [token, userData]); // Phụ thuộc vào token và userData

  // ----------------------------------------------------------------
  // SỬA LỖI SỐ 2: Race Condition khi tải tin nhắn
  // ----------------------------------------------------------------
  useEffect(() => {
    // Guard clause
    if (!receiverId || !userData?.id) {
      setMessages([]); // Xóa tin nhắn cũ nếu không chọn ai
      return;
    }

    // Khởi tạo AbortController để hủy request cũ
    const controller = new AbortController();

    const fetchMessages = async () => {
      try {
        const res = await axios.get(
          `${backendUrl}/api/user/${userData.id}/${receiverId}`,
          { signal: controller.signal } // <-- Gắn signal vào request
        );
        setMessages(res.data);
      } catch (err) {
        // Bỏ qua lỗi nếu đó là lỗi do chúng ta chủ động hủy (abort)
        if (err.name === "CanceledError") {
          console.log("Request tải tin nhắn cũ đã bị hủy.");
        } else {
          console.error("Lỗi fetch messages:", err);
        }
      }
    };

    fetchMessages();

    // Cleanup function: Sẽ chạy khi receiverId thay đổi
    return () => {
      controller.abort(); // <-- Hủy request cũ
    };
  }, [receiverId, userData?.id]); // Phụ thuộc chính xác vào 2 ID này

  // ----------------------------------------------------------------
  // SỬA LỖI SỐ 3: Dùng useCallback
  // ----------------------------------------------------------------
  const checkRQpartner = useCallback(async () => {
    if (!token) return;
    try {
      let { data } = await axios.get(backendUrl + "/api/partner/check", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        setrq(data.data);
      } else {
        console.log("Lỗi dữ liệu checkRQpartner");
      }
    } catch (e) {
      console.log("Lỗi từ frontend (checkRQpartner):", e.message);
    }
  }, [token]);

  useEffect(() => {
    checkRQpartner();
  }, [checkRQpartner]);

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
    checkRQpartner,
    rq,
  };
  return (
    <SocketContext.Provider value={value}>
      {props.children}
    </SocketContext.Provider>
  );
};

export default SocketContextProvider;
