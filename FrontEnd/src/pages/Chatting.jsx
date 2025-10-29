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
    friends,
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
    return user ? user.lastname + " " + user.firstname : `User ${id}`;
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
  console.log(friends[0]?.friend_id);
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
                  key={msg.message_id}
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
            <b>Bạn bè</b>
            <ul style={{ paddingLeft: "0" }}>
              {friends.map((item) => {
                if (item.friend_id === userData.partner) return;
                return (
                  <li
                    key={item.friend_id}
                    style={{
                      cursor: "pointer",
                      fontWeight:
                        item.friend_id === receiverId ? "bold" : "normal",
                      listStyle: "none",
                    }}
                    onClick={() => setReceiverId(item.friend_id)}
                  >
                    <div className="info">
                      <img src={item.image_url}></img>
                      {getUsername(item.friend_id)}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="Partner col-7">
            <p>Người yêu của bạn</p>
            {userData?.partner ? (
              <div
                onClick={() => setReceiverId(userData?.partner)}
                style={{
                  cursor: "pointer",
                  fontWeight:
                    userData?.partner === receiverId ? "bold" : "normal",
                }}
              >
                <div className="info">
                  <img src={allUsersList[userData?.partner]?.image_url}></img>
                  {getUsername(userData?.partner)}
                </div>
              </div>
            ) : (
              <div>Đang ế ...</div>
            )}
          </div>
          <div className="Partner col-7"></div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
