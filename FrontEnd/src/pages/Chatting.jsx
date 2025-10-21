import "./Chatting.scss";
import Sidebar from "../components/SideBar";
import axios from "axios";

import { useEffect, useState, useContext, useRef } from "react";
import { AppContext } from "../context/AppContext";
import { SocketContext } from "../context/SocketContext";

const Dashboard = () => {
  const { token, userData, allUser } = useContext(AppContext);
  const {
    messages,
    setMessages,
    onlineUsers,
    receiverId,
    setReceiverId,
    socket,
  } = useContext(SocketContext);
  const [input, setInput] = useState("");

  const messageBoxRef = useRef(null);

  useEffect(() => {
    if (messageBoxRef.current) {
      messageBoxRef.current.scrollTop = messageBoxRef.current.scrollHeight;
    }
  }, [messages]);

  const allUsersList = allUser ?? [];
  const getUsername = (id) => {
    if (id === userData.id) return "You";
    const user = allUsersList.find((u) => u.id === id);
    return user ? user.username : `User ${id}`;
  };

  // Gửi tin nhắn
  const sendMessage = async () => {
    if (!input || !socket || !receiverId || !userData) return;

    const newMsg = {
      sender_id: userData.id,
      receiver_id: receiverId,
      content: input,
    };

    // Gửi realtime
    socket.emit("send_message", newMsg);

    setInput("");
  };

  return (
    <div className="Chatting-container container-fluid">
      <div className="Chatting-content row pt-3">
        <div className="Chatting-left col-3 ">
          <Sidebar />
        </div>
        <div className="Chatting-mid col-6 row">
          <div className="message-top col-12">
            <div>
              Chat with{" "}
              {receiverId === userData?.id ? "Myseft" : getUsername(receiverId)}
            </div>

            <div>
              <i className="fa-solid fa-phone"></i>
              <i className="fa-solid fa-video"></i>
            </div>
          </div>
          <div className="Message-box col-12" ref={messageBoxRef}>
            {messages
              .filter(
                (msg) =>
                  (msg.sender_id === userData?.id &&
                    msg.receiver_id === receiverId) ||
                  (msg.sender_id === receiverId &&
                    msg.receiver_id === userData?.id)
              )
              .map((msg, idx) => (
                <div
                  key={idx}
                  style={{
                    textAlign:
                      msg.sender_id === userData?.id ? "right" : "left",
                  }}
                >
                  <b>
                    {msg.sender_id === userData?.id
                      ? "You"
                      : getUsername(msg.sender_id)}
                  </b>
                  : <span className="Message">{msg.content}</span>
                </div>
              ))}{" "}
          </div>
          <div className="message-bottom col-12">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            ></input>
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
        <div className="Chatting-right col-3 row ">
          <div className="Online-users col-7">
            <p>Người đang online</p>
            <ul>
              {onlineUsers.map((id) => (
                <li
                  key={id}
                  style={{
                    cursor: "pointer",
                    fontWeight: id === receiverId ? "bold" : "normal",
                    listStyle: "none",
                  }}
                  onClick={() => setReceiverId(id)}
                >
                  {getUsername(id)}
                </li>
              ))}
            </ul>
          </div>
          <div className="Partner col-7">
            <p>Người yêu của bạn</p>
            <div
              onClick={() => setReceiverId(userData?.partner)}
              style={{
                cursor: "pointer",
                fontWeight:
                  userData?.partner === receiverId ? "bold" : "normal",
              }}
            >
              {getUsername(userData?.partner)}
            </div>
          </div>
          <div className="Partner col-7"></div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
