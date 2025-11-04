import { useState, useContext, useEffect } from "react";
import "./Register.scss";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

const register = () => {
  let navigate = useNavigate();
  let [isShowPass, setShowPass] = useState(false);
  let [username, setUsername] = useState("");
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  let [confirmPassword, setConfirmPassword] = useState("");
  let [firstname, setFirstname] = useState("");
  let [lastname, setLastname] = useState("");
  let [message, setMessage] = useState("");
  let { backendUrl, token } = useContext(AppContext);

  let handleSubmitRegister = async (event) => {
    event.preventDefault();
    const { data } = await axios.post(backendUrl + "/api/user/register", {
      username,
      password,
      confirmPassword,
      email,
      firstname,
      lastname,
    });

    if (data.success) {
      setMessage("");
      navigate("/login");
    } else {
      setMessage(data.message);
    }
  };

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token]);

  return (
    <form onSubmit={handleSubmitRegister} className="register-bgr">
      <div className="register-container">
        <div className="register-content row">
          <div className="col-12 text-register">Register</div>
          <div className="col-12 form-group">
            <label>Username</label>
            <input
              type="text"
              className="form-control text-input"
              name="username"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="col-6 form-group">
            <label>Last Name</label>
            <input
              type="text"
              className="form-control text-input"
              name="lastname"
              placeholder="Enter your lastname"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
            />
          </div>
          <div className="col-6 form-group">
            <label>First Name</label>
            <input
              type="text"
              className="form-control text-input"
              name="firstname"
              placeholder="Enter your firstname"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
            />
          </div>

          <div className="col-12 form-group">
            <label>Email</label>
            <input
              type="email"
              className="form-control"
              name="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></input>
          </div>
          <div className="col-12 form-group ">
            <label>Password</label>
            <div className="pass-eye">
              <input
                type={isShowPass ? "text" : "password"}
                className="form-control text-input"
                name="password"
                placeholder="Enter your password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />
              <div
                onClick={() => {
                  setShowPass(!isShowPass);
                }}
              >
                <i
                  className={
                    isShowPass
                      ? "fa-solid fa-eye-slash eye"
                      : "fa-solid fa-eye eye"
                  }
                ></i>
              </div>
            </div>
          </div>
          <div className="col-12 form-group ">
            <label>Confirm Password</label>
            <div className="pass-eye">
              <input
                type={isShowPass ? "text" : "password"}
                className="form-control text-input"
                name="ConfirmPassword"
                placeholder="Enter your confirm password"
                onChange={(e) => setConfirmPassword(e.target.value)}
                value={confirmPassword}
              />
              <div
                onClick={() => {
                  setShowPass(!isShowPass);
                }}
              >
                <i
                  className={
                    isShowPass
                      ? "fa-solid fa-eye-slash eye"
                      : "fa-solid fa-eye eye"
                  }
                ></i>
              </div>
            </div>
          </div>

          <div className="col-12" style={{ color: "red" }}>
            {message}
          </div>
          <div className="col-12 text-right">
            <span>Already have an account?</span>
            <span className="click" onClick={() => navigate("/login")}>
              Login
            </span>
          </div>
          <div className="col-12">
            <button className="btn-input" type="submit">
              Register
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default register;
