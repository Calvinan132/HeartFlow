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

  const [currentDate, setCurrentDate] = useState(new Date());

  const loveDateObj = new Date(loveDate);
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);
  const [year, setYear] = useState(0);
  const [month, setMonth] = useState(0);
  const [week, setWeek] = useState(0);
  const [day, setDay] = useState(0);

  useEffect(() => {
    if (!loveDate) return;

    const loveDateObj = new Date(loveDate);
    const now = new Date(); // Dùng thời gian hiện tại để tính chính xác

    let years = now.getFullYear() - loveDateObj.getFullYear();
    let months = now.getMonth() - loveDateObj.getMonth();
    let days = now.getDate() - loveDateObj.getDate();

    // Hàm lấy số ngày trong tháng
    const getDayofMonth = (m, y) => {
      return new Date(y, m + 1, 0).getDate(); // Cách nhanh hơn để lấy số ngày
    };

    if (days < 0) {
      months--;
      // Lấy số ngày của tháng trước đó
      const prevMonthDays = getDayofMonth(
        now.getMonth() - 1,
        now.getFullYear()
      );
      days += prevMonthDays;
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    const weeks = Math.floor(days / 7);
    const remainingDays = days % 7;

    setYear(years);
    setMonth(months);
    setWeek(weeks);
    setDay(remainingDays);
  }, [loveDate, currentDate]);

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
                  value={tmpDate}
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
            <span>{year < 10 ? "0" + year : year}</span>
            <b>Năm</b>
          </div>
          <div className="block-date">
            <span>{month < 10 ? "0" + month : month}</span>
            <b>Tháng</b>
          </div>
          <div className="block-date">
            <span>{week < 10 ? "0" + week : week}</span>
            <b>tuần</b>
          </div>
          <div className="block-date">
            <span>{day < 10 ? "0" + day : day}</span>
            <b>Ngày</b>
          </div>
        </div>
        <div className="now-date">#{currentDate.toLocaleDateString("Vi")}</div>
        <div className="time">{`${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}`}</div>
      </div>
      <div className="notification">
        <span>
          Đôi khi ta thích một người chỉ bởi vì người đó CÃI NHAU rẩt hợp với
          mình
        </span>
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
