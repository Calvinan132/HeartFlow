import "./Suggest.scss";
import axios from "axios";
import { AppContext } from "../../context/AppContext";
import { useContext, useState, useEffect } from "react";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

let Suggest = ({
  img,
  lastname,
  firstname,
  pLastname,
  pFirstname,
  receiverId,
}) => {
  const { token } = useContext(AppContext);
  const [checkAdd, setCheckAdd] = useState([]);
  let handleAdd = async (receiverId) => {
    try {
      const payload = {
        receiverId,
      };
      let { data } = await axios.post(
        backendUrl + "/api/friend/request",
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      check();
    } catch (e) {
      console.log(e);
    }
  };

  let check = async () => {
    try {
      let { data } = await axios.get(backendUrl + "/api/friend/pendingcheck", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        setCheckAdd(data.requests);
      } else {
        console.log("Lỗi gì đó !", data.message);
      }
    } catch (e) {
      console.log(e.message);
    }
  };
  useEffect(() => {
    if (token) {
      check();
    }
  }, [token]);
  return (
    <div className="Suggest-container col ">
      <div className="info">
        <div className="pile">
          <img className="avt" src={img}></img>
          <div className="name">{lastname + " " + firstname}</div>
        </div>
        <div className="partner">
          {pLastname
            ? "Đang hẹn hò với: " + pLastname + " " + pFirstname
            : "Tình trạng: Độc thân"}
        </div>
        <div className="act">
          {!checkAdd.some((user) => user.receiver_id === receiverId) ? (
            <div
              className="add"
              onClick={() => {
                handleAdd(receiverId);
              }}
            >
              Kết bạn
            </div>
          ) : (
            <div className="add">Đã gửi</div>
          )}
          <div className="next">Bỏ qua</div>
        </div>
      </div>
    </div>
  );
};

export default Suggest;
