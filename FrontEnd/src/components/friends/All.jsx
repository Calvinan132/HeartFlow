import Suggest from "./Suggest";
import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { SocketContext } from "../../context/SocketContext";
import { AppContext } from "../../context/AppContext";
import "./All.scss";
let All = () => {
  const { token, allUser, userData, backendUrl } = useContext(AppContext);
  const { friends, loadFriends, rq } = useContext(SocketContext);

  const [requestData, setRequestData] = useState([]);
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
    <div>
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
        <div className="display-info ">
          <div className="row row-cols-1 row-cols-md-3 g-3">
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
    </div>
  );
};

export default All;
