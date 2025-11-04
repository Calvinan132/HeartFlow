import { useState, useContext, useEffect } from "react";
import "./Login.scss";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  let navigate = useNavigate();
  let [isShowPass, setShowPass] = useState(false);
  let [username, setUsername] = useState("");
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  let [message, setMessage] = useState("");
  let { backendUrl, token, setToken, userData } = useContext(AppContext);

  let handleSubmitLogin = async (event) => {
    event.preventDefault();
    const { data } = await axios.post(backendUrl + "/api/user/login", {
      username,
      password,
    });

    if (data.success) {
      localStorage.setItem("token", data.token);
      setToken(data.token);
      setMessage("");
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
    <form onSubmit={handleSubmitLogin} className="login-bgr">
      <div className="login-container">
        <div className="login-content row">
          <div className="col-12 text-login">Login</div>
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

          <div className="col-12" style={{ color: "red" }}>
            {message}
          </div>

          <div className="col-12">
            <button className="btn-input" type="submit">
              Login
            </button>
          </div>
          <div className="col-12 text-right">
            <span className="click" onClick={() => navigate("/register")}>
              Create an account?
            </span>
          </div>
          <div className="col-12 text-center">
            <span className="other-login">Or login with:</span>
          </div>
          <div className="col-12 app-login">
            <i className="fa-brands fa-google gg"></i>
            <i className="fa-brands fa-facebook fb"></i>
          </div>
        </div>
      </div>
    </form>
  );
};

export default Login;
