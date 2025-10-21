import Sidebar from "../components/SideBar";
import "./friends.scss";
import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { AppContext } from "../context/AppContext";
import { SocketContext } from "../context/SocketContext";
import Friend from "../components/friends/Friend";
import Suggest from "../components/friends/Suggest";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

let Friends = () => {
  const [requestData, setRequestData] = useState([]);
  const { token, allUser, userData } = useContext(AppContext);
  const { friends, loadFriends } = useContext(SocketContext);

  let loadRequest = async () => {
    try {
      let { data } = await axios.get(backendUrl + "/api/friend/pending", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        setRequestData(data.requests);
      } else {
        console.log("Lỗi gì đó !", data.message);
      }
    } catch (e) {
      console.log(e.message);
    }
  };
  let handleAccept = async (senderId) => {
    try {
      const payload = {
        senderId,
        action: "accept",
      };
      let { data } = await axios.put(
        backendUrl + "/api/friend/response",
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      loadRequest();
      loadFriends();
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
        backendUrl + "/api/friend/response",
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      loadRequest();
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (token) {
      loadRequest();
    }
  }, [token]);

  return (
    <div className="AddFriends-container container-fluid">
      <div className="AddFriends-content row pt-3">
        <div className="Left-content col-3">
          <Sidebar></Sidebar>
        </div>
        <div className="Mid-content col-6">
          <div className="Search">
            <i className="fa-solid fa-magnifying-glass"></i>
          </div>
          <div className="Request">
            <p className="title">Lời mời kết bạn</p>
            {requestData.map((item, index) => {
              return (
                <div className="Request-info" key={index}>
                  <div className="info">
                    <img className="avt" src={item.image_url}></img>
                    <div className="name">
                      {item.lastname + " " + item.firstname}
                      <br></br>
                      <p>Đã gửi lời mời kết bạn</p>
                    </div>
                  </div>
                  <div className="act">
                    <div
                      className="accept"
                      onClick={() => {
                        handleAccept(item.sender_id);
                      }}
                    >
                      Chấp nhận
                    </div>
                    <div
                      className="refuse"
                      onClick={() => {
                        handleReject(item.sender_id);
                      }}
                    >
                      Từ chối
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="Suggest">
            <p className="title">Gợi ý kết bạn</p>
            <div className="display-info gap-2">
              {allUser.map((item, index) => {
                if (item.id === userData.id) return;
                if (friends.some((user) => user.friend_id === item.id)) return;
                return (
                  <Suggest
                    receiverId={item.id}
                    img={item.image_url}
                    lastname={item.lastname}
                    firstname={item.firstname}
                    key={index}
                  ></Suggest>
                );
              })}
            </div>
          </div>
        </div>
        <div className="Right-content col-3">
          <div className="List">
            <b>Danh sách bạn bè</b>

            {friends.map((item, index) => {
              return (
                <Friend
                  img={item.image_url}
                  lastname={item.lastname}
                  firstname={item.firstname}
                  Id={item.friend_id}
                  key={index}
                ></Friend>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Friends;
