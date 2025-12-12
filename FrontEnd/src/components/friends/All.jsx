import Suggest from "./Suggest";
import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { AppContext } from "../../context/AppContext";
import "./All.scss";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchFriends,
  checkRQfriend,
  FHandleAccept,
  FHandleReject,
} from "../../redux/features/slices/friendSlice";
let All = () => {
  //redux
  const dispatch = useDispatch();
  const friends = useSelector((state) => state.friend.friends);
  const rqFriends = useSelector((state) => state.friend.rqFriends);
  useEffect(() => {
    dispatch(checkRQfriend({ token: token, backendUrl: backendUrl }));
    dispatch(fetchFriends({ token: token, backendUrl: backendUrl }));
  }, [friends]);
  //

  const { token, allUser, userData, backendUrl } = useContext(AppContext);

  let handleAccept = async (senderId) => {
    dispatch(FHandleAccept({ token: token, backendUrl: backendUrl, senderId }));
  };
  const handleReject = async (senderId) => {
    dispatch(FHandleReject({ token: token, backendUrl: backendUrl, senderId }));
  };

  return (
    <div>
      <div className="Request">
        <p className="title">Lời mời kết bạn</p>
        {rqFriends?.map((item, index) => {
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
              if (friends?.some((user) => user.friend_id === item.id)) return;
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
