import "./Partner.scss";
import axios from "axios";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { SocketContext } from "../context/SocketContext";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

let Partner = ({ img, lastname, firstname, Id }) => {
  const { token } = useContext(AppContext);
  const { checkRQpartner } = useContext(SocketContext);
  let handleAccept = async (senderId) => {
    try {
      const payload = {
        senderId,
        action: "accept",
      };
      let { data } = await axios.put(
        backendUrl + "/api/partner/response",
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      checkRQpartner();
    } catch (e) {
      console.log(e);
    }
  };

  const handleReject = async (senderId) => {
    try {
      let payload = {
        senderId,
        action: "reject",
      };
      let { data } = await axios.put(
        backendUrl + "/api/partner/response",
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      checkRQpartner();
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <div className="Partner">
      <div className="Container-info">
        <img className="avt" src={img}></img>
        <div className="name">{lastname + " " + firstname}</div>
        <i className="fa-solid fa-heart-pulse"></i>
      </div>
      <div className="act">
        <div
          className="add-partner"
          onClick={() => {
            handleAccept(Id);
          }}
        >
          Đồng ý
        </div>
        <div
          className="unfriend"
          onClick={() => {
            handleReject(Id);
          }}
        >
          Từ chối
        </div>
      </div>
    </div>
  );
};

export default Partner;
