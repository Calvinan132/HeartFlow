import "./Notification.scss";
import { useContext } from "react";
import { SocketContext } from "../context/SocketContext";

const tinhThoiGianTroiQua = (thoiGianGocISOString) => {
  const thoiDiemGocTimestamp = new Date(thoiGianGocISOString).getTime();

  const bayGio = new Date().getTime();
  const khoangThoiGianMs = bayGio - thoiDiemGocTimestamp;

  const giay = Math.floor(khoangThoiGianMs / 1000);

  if (giay < 60) {
    return `Vài giây trước`;
  } else if (giay < 3600) {
    const phut = Math.floor(giay / 60);
    return `${phut} phút trước`;
  } else if (giay < 86400) {
    const gio = Math.floor(giay / 3600);
    return `${gio} giờ trước`;
  } else if (giay < 2592000) {
    const ngay = Math.floor(giay / 86400);
    return `${ngay} ngày trước`;
  } else {
    // Nếu quá lâu, hiển thị ngày tháng đầy đủ
    return new Date(thoiDiemGocTimestamp).toLocaleDateString("vi-VN");
  }
};

let Notification = () => {
  const { notification } = useContext(SocketContext);
  if (!notification || notification.length === 0) {
    return (
      <div className="drop-notification empty">
        <div className="title-no">
          <b>Thông báo</b>
        </div>
        <div className="empty-msg">Chưa có thông báo nào</div>
      </div>
    );
  }
  return (
    <ul className="drop-notification " style={{ zIndex: "10000000" }}>
      <div className="title-no">
        <b>Thông báo </b>
      </div>
      {notification.map((item, index) => (
        <li key={index}>
          <img src={item.senderAvatar}></img>
          <div>
            <b>{item.senderName + " "}</b>
            <span>{item.message}</span>
            <br></br>
            <span>{tinhThoiGianTroiQua(item.time)}</span>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default Notification;
