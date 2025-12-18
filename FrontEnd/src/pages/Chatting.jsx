import "./Chatting.scss";
import Sidebar from "../components/Sidebar";

import {
  useEffect,
  useState,
  useContext,
  useRef,
  useMemo,
  useCallback,
  use,
} from "react";
import { AppContext } from "../context/AppContext";
import { SocketContext } from "../context/SocketContext";
import { useSelector } from "react-redux";

const Dashboard = () => {
  const { userData, allUser } = useContext(AppContext);
  const { messages, onlineUsers, receiverId, setReceiverId, socket } =
    useContext(SocketContext);
  const [input, setInput] = useState("");

  const messageBoxRef = useRef(null);

  useEffect(() => {
    if (messageBoxRef.current) {
      messageBoxRef.current.scrollTop = messageBoxRef.current.scrollHeight;
    }
  }, [messages]);

  const friends = useSelector((state) => state.friend.friends);

  const allUsersList = allUser ?? [];
  const userMap = useMemo(() => {
    const map = new Map();
    if (allUser) {
      allUser.forEach((user) => {
        map.set(user.id, user);
      });
    }
    return map;
  }, [allUser]);

  const getUsername = useCallback(
    (id) => {
      if (id === userData?.id) return "You";

      // Tra cứu trong Map (siêu nhanh) thay vì .find() (siêu chậm)
      const user = userMap.get(id);
      return user ? user.lastname + " " + user.firstname : `User ${id}`;
    },
    [userMap, userData] // Phụ thuộc vào userMap và userData
  );

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

  let checkOnline = (userId) => {
    return onlineUsers.some((id) => id === userId);
  };
  return (
    <div className="Chatting-container container-fluid">
      <div className="Chatting-content row pt-3">
        <div className="Chatting-left d-none d-md-flex col-md-3 ">
          <Sidebar />
        </div>
        <div className="Chatting-mid col-12 col-md-6">
          {!receiverId ? (
            <div className="list-fr d-md-none">
              <div className="friend-list">
                <b>Bạn bè</b>
                <ul style={{ paddingLeft: "0" }}>
                  {friends?.map((item) => {
                    return (
                      <li
                        key={item.friend_id}
                        style={{
                          cursor: "pointer",
                          listStyle: "none",
                        }}
                        onClick={() => setReceiverId(item.friend_id)}
                      >
                        <div className="info">
                          <img src={item.image_url}></img>
                          <div className="name-status">
                            <div className="name">
                              {getUsername(item.friend_id)}
                            </div>
                            <div className="status">
                              {checkOnline(item.friend_id)
                                ? "Online"
                                : "Offline"}
                              <div
                                className="dot"
                                style={
                                  checkOnline(item.friend_id)
                                    ? { backgroundColor: "green" }
                                    : { backgroundColor: "gray" }
                                }
                              ></div>
                            </div>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          ) : null}
          <div className="box" style={receiverId ? {} : { display: "none" }}>
            <div className="message-top">
              <div className="left d-flex">
                <div
                  className="back d-md-none"
                  onClick={() => setReceiverId(null)}
                  style={{ cursor: "pointer", marginRight: "10px" }}
                >
                  <i className="fa-solid fa-arrow-left"></i>
                </div>
                <div>
                  Chat with{" "}
                  {receiverId === userData?.id
                    ? "Myseft"
                    : getUsername(receiverId)}
                </div>
              </div>

              <div className="right">
                <i className="fa-solid fa-phone"></i>
                <i className="fa-solid fa-video"></i>
              </div>
            </div>
            <div className="Message-box col-12 " ref={messageBoxRef}>
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
                    key={msg.message_id || idx}
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
        </div>
        <div className="Chatting-right d-none d-md-flex col-md-3 ">
          <div className="partner-info">
            <b>Người yêu của bạn</b>
            {userData?.partner ? (
              <div
                className="info"
                onClick={() => setReceiverId(userData?.partner)}
                style={{
                  cursor: "pointer",
                }}
              >
                <img src={allUsersList[userData?.partner]?.image_url}></img>
                <div className="name-status">
                  <div
                    className="name"
                    style={{
                      fontWeight:
                        userData?.partner === receiverId ? "bold" : "normal",
                    }}
                  >
                    {getUsername(userData?.partner)}
                  </div>
                  <div className="status">
                    {checkOnline(userData?.partner) ? "Online" : "Offline"}
                    <div
                      className="dot"
                      style={
                        checkOnline(userData?.partner)
                          ? { backgroundColor: "green" }
                          : { backgroundColor: "gray" }
                      }
                    ></div>
                  </div>
                </div>
              </div>
            ) : (
              <div>Đang ế ...</div>
            )}
          </div>
          <div className="Online-users">
            <b>Bạn bè</b>
            <ul style={{ paddingLeft: "0" }}>
              {friends.map((item) => {
                if (item.friend_id === userData.partner) return null;
                return (
                  <li
                    key={item.friend_id}
                    style={{
                      cursor: "pointer",
                      listStyle: "none",
                    }}
                    onClick={() => setReceiverId(item.friend_id)}
                  >
                    <div className="info">
                      <img src={item.image_url}></img>
                      <div className="name-status">
                        <div
                          className="name"
                          style={{
                            fontWeight:
                              item.friend_id === receiverId ? "bold" : "normal",
                          }}
                        >
                          {getUsername(item.friend_id)}
                        </div>
                        <div className="status">
                          {checkOnline(item.friend_id) ? "Online" : "Offline"}
                          <div
                            className="dot"
                            style={
                              checkOnline(item.friend_id)
                                ? { backgroundColor: "green" }
                                : { backgroundColor: "gray" }
                            }
                          ></div>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
