import "./Dashboard.scss";
import Sidebar from "../components/Sidebar";
import Counter from "../components/Dashboard/Counter";
import { useState, useContext, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import { useDispatch, useSelector } from "react-redux";
import { setDate, fetchLoveDate } from "../redux/features/slices/counterSlice";
const Dashboard = () => {
  const dispatch = useDispatch();
  const [tmpDate, settmp] = useState("");
  const { token, userData, backendUrl } = useContext(AppContext);

  const loveDate = useSelector((state) => state.counter.loveDate);

  let handleSubmit = async () => {
    dispatch(
      setDate({ token: token, newDate: tmpDate, backendUrl: backendUrl })
    );
  };

  useEffect(() => {
    dispatch(
      fetchLoveDate({
        token: token,
        partnerId: userData?.partner,
        backendUrl: backendUrl,
      })
    );
  }, [loveDate]);
  return (
    <div className="Dashboard-container container-fluid">
      <div className="Dashboard-content row ">
        <div className="Dashboard-left d-none d-md-flex col-md-3 pt-3 ">
          <Sidebar></Sidebar>
        </div>
        <div className="Dashboard-mid col-12 col-md-6 pt-3 pt-md-0 mt-2">
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
                  value={loveDate}
                  onChange={(e) => {
                    settmp(e.target.value);
                  }}
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
