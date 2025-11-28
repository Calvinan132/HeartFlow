import "./Notification.scss";
import { useContext } from "react";
import { SocketContext } from "../context/SocketContext";

let Notification = () => {
  const { notification } = useContext(SocketContext);
  return (
    <ul className="drop-notification " style={{ zIndex: "10000000" }}>
      <div className="title-no">
        <b>Thông báo </b>
      </div>
      {notification.map((item, index) => (
        <li key={index}>
          <img src={item.senderAvatar}></img>
          <div>
            <b>{item.senderName}</b>
            <span>{item.message}</span>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default Notification;
