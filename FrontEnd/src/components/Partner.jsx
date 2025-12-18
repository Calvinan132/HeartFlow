import "./Partner.scss";
import axios from "axios";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { SocketContext } from "../context/SocketContext";
import { useDispatch, useSelector } from "react-redux";
import {
  checkRQpartner,
  handleRQpartner,
} from "../redux/features/slices/partnerSlice";

let Partner = ({ img, lastname, firstname, Id }) => {
  const { token, backendUrl } = useContext(AppContext);
  const dispatch = useDispatch();
  let handleAccept = async (senderId) => {
    dispatch(
      handleRQpartner({
        token: token,
        backendUrl: backendUrl,
        senderId: senderId,
        action: "accept",
      })
    );
  };

  const handleReject = async (senderId) => {
    dispatch(
      handleRQpartner({
        token: token,
        backendUrl: backendUrl,
        senderId: senderId,
        action: "reject",
      })
    );
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
