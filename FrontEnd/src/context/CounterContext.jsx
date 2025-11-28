import { createContext, useEffect, useState, useContext } from "react";
import axios from "axios";
import { AppContext } from "../context/AppContext";

export const CounterContext = createContext();

const CounterContextProvider = (props) => {
  const [loveDate, setLoveDate] = useState("");
  const [totalDate, setTotal] = useState(0);
  const { token, userData, backendUrl } = useContext(AppContext);

  let loadDate = async () => {
    const PartnerId = userData?.partner;
    try {
      let { data } = await axios.get(
        backendUrl + `/api/partner/loaddate/${PartnerId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (data.success) {
        setLoveDate(data.date[0]?.love_date);
        setTotal(data.date[0]?.loveDay);
      }
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
