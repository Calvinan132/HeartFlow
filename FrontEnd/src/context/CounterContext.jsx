import { createContext, useEffect, useState, useContext } from "react";
import axios from "axios";
import { AppContext } from "../context/AppContext";

export const CounterContext = createContext();

const CounterContextProvider = (props) => {
  const [loveDate, setLoveDate] = useState("");
  const [totalDate, setTotal] = useState(0);
  const { token, userData, backendUrl } = useContext(AppContext);

  let now = new Date();
  let counter = () => {
    // Nếu chưa có ngày bắt đầu, đặt tổng ngày là 0
    if (!loveDate) {
      setTotal(0);
      return;
    }
    const start = new Date(loveDate);
    // Xử lý trường hợp ngày không hợp lệ
    if (isNaN(start.getTime())) {
      setTotal(0);
      return;
    }
    let now = new Date();

    // Tính toán số ngày
    var totalDays = Math.floor((now - start) / (1000 * 60 * 60 * 24));
    setTotal(totalDays);
  };
  useEffect(() => {
    counter();
    const intervalId = setInterval(counter, 60000); // 60000ms = 1 phút
    return () => clearInterval(intervalId);
  }, [loveDate]);

  let loadDate = async () => {
    const PartnerId = userData?.partner;
    try {
      let { data } = await axios.get(
        backendUrl + `/api/partner/loaddate/${PartnerId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (data.success) setLoveDate(data.date[0]?.love_date);
    } catch (e) {
      console.log("Lỗi từ frontend!", e.message);
    }
  };

  useEffect(() => {
    loadDate();
  }, [token, userData?.partner]);

  const value = {
    loveDate,
    setLoveDate,
    totalDate,
  };
  return (
    <CounterContext.Provider value={value}>
      {props.children}
    </CounterContext.Provider>
  );
};
export default CounterContextProvider;
