import "./Dashboard.scss";
import Sidebar from "../components/Sidebar";
import Counter from "../components/Dashboard/Counter";
import { useState, useContext } from "react";
import { CounterContext } from "../context/CounterContext";
import { AppContext } from "../context/AppContext";
import axios from "axios";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const Dashboard = () => {
  const [tmpDate, settmp] = useState("");
  const { loveDate, setLoveDate } = useContext(CounterContext);
  const { token } = useContext(AppContext);

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
  return (
    <div className="Dashboard-container container-fluid">
      <div className="Dashboard-content row ">
        <div className="Dashboard-left d-none d-md-flex col-md-3 pt-3 ">
          <Sidebar></Sidebar>
        </div>
        <div className="Dashboard-mid col-12 col-md-6 pt-3 pt-md-0">
          <Counter></Counter>
        </div>
        <div className="Dashboard-right d-none d-md-flex col-md-3 pt-3">
          <div className="Date">
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
          <div className="Task mt-3"></div>
          <div className="Partner mt-3"></div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
