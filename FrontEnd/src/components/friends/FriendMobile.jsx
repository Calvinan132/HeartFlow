import { useContext } from "react";
import { SocketContext } from "../../context/SocketContext";
import { AppContext } from "../../context/AppContext";
import "./FriendMobile.scss";
let FriendMobile = () => {
  const { friends } = useContext(SocketContext);

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
