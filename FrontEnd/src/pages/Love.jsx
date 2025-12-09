import Sidebar from "../components/Sidebar";
import "./Love.scss";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";

let Love = () => {
  const { userData, allUser, token, backendUrl, loadUserData } =
    useContext(AppContext);
  const partner = allUser.find((user) => user.id === userData.partner);

  let handleUnlove = async () => {
    console.log(token, backendUrl);
    try {
      let { data } = await axios.post(
        backendUrl + "/api/partner/unlove",
        { partnerId: userData?.partner },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      loadUserData();
    } catch (e) {
      console.log("Lỗi từ frontend:" + e.message);
    }
  };

  return (
    <div className="Love-container container-fluid">
      <div className="Love-content row pt-3">
        <div className="left-love d-none d-md-flex col-md-3 ">
          <Sidebar></Sidebar>
        </div>
        <div className="mid-love col-12 col-md-6 ">
          <div className="border w-100 h-100">
            {partner ? (
              <div className="acc">
                <img
                  src={partner?.image_url}
                  style={{ width: "50px", height: "50px" }}
                ></img>
                <b>{partner?.lastname + " " + partner?.firstname}</b>
                <button
                  className="btn"
                  onClick={() => {
                    handleUnlove();
                  }}
                >
                  Chia tay
                </button>
              </div>
            ) : (
              <> </>
            )}
          </div>
        </div>
        <div className="right-love  d-none d-md-flex col-md-3 "></div>
      </div>
    </div>
  );
};

export default Love;
