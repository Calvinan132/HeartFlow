import { CounterContext } from "../../context/CounterContext";
import { AppContext } from "../../context/AppContext";
import { useState, useContext, useEffect } from "react";
import axios from "axios";
import "./Counter.scss";

const Counter = () => {
  const { token, backendUrl } = useContext(AppContext);
  const { totalDate } = useContext(CounterContext);
  const { userData, allUser } = useContext(AppContext);
  const [tmpDate, settmp] = useState("");
  const { loveDate, setLoveDate } = useContext(CounterContext);

  const [isMdOrLarger, setIsMdOrLarger] = useState(window.innerWidth >= 768);
  useEffect(() => {
    const handleResize = () => {
      setIsMdOrLarger(window.innerWidth >= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const [isShow, setShow] = useState(false);
  let togglePopup = () => {
    if (!isMdOrLarger) {
      setShow(!isShow);
    } else {
      console.log("Onclick bị vô hiệu hóa vì màn hình nhỏ hơn MD.");
    }
  };

  const partner = allUser.find((user) => user.id === userData.partner);

  let handleSetDate = (e) => {
    settmp(e.target.value);
  };
  let handleSubmit = async () => {
    try {
      if (!tmpDate) {
        return;
      }
      const payload = {
        loveDate: tmpDate,
      };
      let { data } = await axios.put(
        backendUrl + "/api/partner/setdate",
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setLoveDate(tmpDate);
    } catch (e) {
      console.log(e);
    }
  };
  const currentDate = new Date();
  const loveDateObj = new Date(loveDate);
  return (
    <div className="Dashboard-counter col-12">
      <div className="title">
        Our Journey
        <div className="underline"></div>
      </div>
      <div className="Counter">
        <div className="Day-counter" onClick={togglePopup}>
          {!totalDate ? "00" : totalDate < 10 ? "0" + totalDate : totalDate}
        </div>
        <span>Days Together</span>
        <div id="collapsePopup" style={isShow ? {} : { display: "none" }}>
          <div className="Date">
            <div className="Cancel" onClick={togglePopup}>
              <i className="fa-solid fa-xmark"></i>
            </div>
            <div className="Date-container">
              <b>Love days</b>
              <div className="Date-input">
                <input
                  type="date"
                  className="form-control"
                  value={tmpDate ? tmpDate : loveDate}
                  onChange={handleSetDate}
                ></input>
                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  onClick={handleSubmit}
                >
                  submit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="content ">
        {userData ? (
          <div className="user">
            <img src={userData.image_url}></img>
            <b className="name">
              {userData.lastname + " " + userData.firstname}
            </b>
          </div>
        ) : (
          <div className="user">
            <img src="https://res.cloudinary.com/dy6glwq3r/image/upload/v1759488628/yhphnu4lksehsqhjjb9j.png"></img>
            <b className="name">Chưa có</b>
          </div>
        )}
        <div className="mid-user">
          <i className="fa-regular fa-heart"></i>
        </div>
        {partner ? (
          <div className="partner">
            <img src={partner.image_url}></img>
            <b className="name">{partner.lastname + " " + partner.firstname}</b>
          </div>
        ) : (
          <div className="partner">
            <img src="https://res.cloudinary.com/dy6glwq3r/image/upload/v1759488628/yhphnu4lksehsqhjjb9j.png"></img>
            <b className="name">Chưa có </b>
          </div>
        )}
      </div>
      <div className="detail-date container-fluid">
        <div className="date-content ">
          <div className="block-date">
            <span>00</span>
            <b>Năm</b>
          </div>
          <div className="block-date">
            <span>00</span>
            <b>Tháng</b>
          </div>
          <div className="block-date">
            <span>00</span>
            <b>tuần</b>
          </div>
          <div className="block-date">
            <span>00</span>
            <b>Ngày</b>
          </div>
        </div>
        <div className="now-date">#00/00/0000</div>
        <div className="time">00:00:00</div>
      </div>
      <div className="journey">
        <div className="line">
          <div className="mid"></div>
          <i className="fa-regular fa-heart" style={{ color: "pink" }}></i>
          <div className="mid"></div>
        </div>
      </div>
      <div className="date">
        <div className="start">
          First Date: {loveDateObj.toLocaleDateString("vi-VN")}
        </div>
        <div className="now">
          Today: {currentDate.toLocaleDateString("vi-VN")}
        </div>
      </div>
    </div>
  );
};

export default Counter;
