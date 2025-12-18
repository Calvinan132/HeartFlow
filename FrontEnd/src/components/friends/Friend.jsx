import { useState, useContext } from "react";
import "./Friend.scss";
import axios from "axios";
import { AppContext } from "../../context/AppContext";
import { Link } from "react-router-dom";

let Friend = ({ img, lastname, firstname, Id }) => {
  const [expand, setExpend] = useState(false);
  const { token, userData, backendUrl } = useContext(AppContext);

  let handleUnfriend = async (Id) => {
    try {
      let payload = {
        Id,
      };
      let { data } = await axios.post(
        backendUrl + "/api/friend/unfriend",
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (e) {
      console.log(e);
    }
  };
  let handleAddPartner = async (Id) => {
    try {
      let payload = {
        Id,
      };

      let { data } = await axios.post(
        backendUrl + "/api/partner/request",
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (e) {
      console.log("Lỗi từ frontend: ", e.message);
    }
  };
  return (
    <div
      className="Friends"
      onClick={() => {
        setExpend(!expand);
      }}
    >
      <div className="Container-info">
        <img className="avt" src={img}></img>
        <Link className="name" to={`/profile/${Id}`}>
          {lastname + " " + firstname}
        </Link>
        <i className="fa-solid fa-angles-down"></i>
      </div>
      <div className="act" style={!expand ? { display: "none" } : {}}>
        <div
          className="add-partner"
          style={userData.partner === null ? {} : { display: "none" }}
          onClick={(e) => {
            e.stopPropagation();
            handleAddPartner(Id);
          }}
        >
          Thêm tri kỷ
        </div>
        <div
          className="unfriend"
          onClick={(e) => {
            e.stopPropagation();
            handleUnfriend(Id);
          }}
        >
          Xóa kết bạn
        </div>
      </div>
    </div>
  );
};

export default Friend;
