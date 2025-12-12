import { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import "./FriendMobile.scss";
import { useSelector } from "react-redux";

let FriendMobile = () => {
  //redux
  const friends = useSelector((state) => state.friend.friends);
  //test
  const { userData } = useContext(AppContext);
  return (
    <div className="container">
      <h1 className="F-tile">{friends ? friends.length : 0} friends</h1>
      {friends?.map((item, index) => {
        if (userData?.partner === item.friend_id) return null;
        return (
          <div className="F-info" key={index}>
            <img className="F-avt" src={item.image_url}></img>
            <div className="F-name">{item.lastname + " " + item.firstname}</div>
          </div>
        );
      })}
    </div>
  );
};

export default FriendMobile;
