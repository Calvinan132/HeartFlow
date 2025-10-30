import { useContext } from "react";
import { CounterContext } from "../../context/CounterContext";
import { AppContext } from "../../context/AppContext";
import "./Counter.scss";

const Counter = () => {
  const { totalDate } = useContext(CounterContext);
  const { userData, allUser } = useContext(AppContext);

  const partner = allUser.find((user) => user.id === userData.partner);
  // console.log(partner);
  return (
    <div className="Dashboard-counter col-12">
      <div className="user">
        <img src={userData.image_url}></img>
        <b className="name">{userData.lastname + " " + userData.firstname}</b>
      </div>
      <div className="Counter">
        <i className="fa-solid fa-heart"></i>
        <div className="Day-counter">
          {!totalDate ? "00" : totalDate < 10 ? "0" + totalDate : totalDate}
        </div>
        <span>Days Together</span>
        <span>200 days milestone in 10 days</span>
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
  );
};

export default Counter;
