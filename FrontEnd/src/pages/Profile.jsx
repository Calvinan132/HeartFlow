import "./Profile.scss";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { AppContext } from "../context/AppContext";
let Profile = () => {
  const { id } = useParams();
  const [Profile, setLoadProfile] = useState([]);
  const { backendUrl, token } = useContext(AppContext);

  useEffect(() => {
    let getProfile = async () => {
      try {
        let { data } = await axios.get(backendUrl + `/api/user/profile/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLoadProfile(data.info);
      } catch (e) {
        console.log(e);
      }
    };
    getProfile();
  }, [Profile?.id]);

  console.log("User Profile Data:", Profile);
  return (
    <div className="container-fluid Profile-container">
      <div className="Profile-header">
        <div className="cover-img"></div>
        <div className="Profile-info">
          <img className="Profile-avt" src={Profile?.image_url}></img>
          <div className="name-totalFriends">
            <h3 className="Profile-name">
              {Profile?.lastname + " " + Profile?.firstname}
            </h3>
            <p className="totalFriends">
              {Profile?.totalFriends + " Người bạn"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
