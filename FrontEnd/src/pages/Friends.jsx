import Sidebar from "../components/Sidebar";
import "./friends.scss";
import { useEffect, useState, useContext } from "react";
import { AppContext } from "../context/AppContext";

import Friend from "../components/friends/Friend";
import FriendMobile from "../components/friends/FriendMobile";
import Partner from "../components/Partner";
import PartnerMobile from "../components/friends/PartnerMobile";
import All from "../components/friends/All";

import { useSelector, useDispatch } from "react-redux";
import { checkRQpartner } from "../redux/features/slices/partnerSlice";

let Friends = () => {
  const { token, backendUrl } = useContext(AppContext);
  //redux
  const dispatch = useDispatch();
  const friends = useSelector((state) => state.friend.friends);
  const rqPartner = useSelector((state) => state.partner.rqPartner);
  useEffect(() => {
    dispatch(checkRQpartner({ token: token, backendUrl: backendUrl }));
  }, []);

  const [Switch, setSwitch] = useState("All");

  let renderSwitch = () => {
    if (Switch === "All") return <All />;
    else if (Switch === "Friend") return <FriendMobile />;
    else if (Switch === "Partner") return <PartnerMobile />;
  };
  console.log("rqPartner:", rqPartner);
  return (
    <div className="AddFriends-container container-fluid">
      <div className="AddFriends-content row pt-3">
        <div className="Left-content d-none d-md-flex col-md-3">
          <Sidebar></Sidebar>
        </div>
        <div className="Mid-content col-12 col-md-6">
          <ul className="F-Catalog d-flex d-md-none">
            <li
              className={Switch === "All" ? "active" : ""}
              onClick={() => {
                setSwitch("All");
              }}
            >
              All
            </li>
            <li
              className={Switch === "Friend" ? "active" : ""}
              onClick={() => {
                setSwitch("Friend");
              }}
            >
              Bạn bè
            </li>
            <li
              className={Switch === "Partner" ? "active" : ""}
              onClick={() => {
                setSwitch("Partner");
              }}
            >
              Người yêu
            </li>
          </ul>
          {renderSwitch()}
        </div>
        <div className="Right-content d-none d-md-flex col-md-3">
          <div className="List">
            <div className="List-f">
              <b>Lời mời tri kỷ</b>
              {rqPartner?.map((item, index) => {
                return (
                  <Partner
                    img={item.image_url}
                    lastname={item.lastname}
                    firstname={item.firstname}
                    Id={item.sender_id}
                    key={index}
                  ></Partner>
                );
              })}
            </div>
            <div className="List-f">
              <b>Danh sách liên hệ</b>
              {friends?.map((item, index) => {
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
    </div>
  );
};

export default Friends;
