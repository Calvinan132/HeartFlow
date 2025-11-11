import "./Navbar.scss";
import React, { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import { NavLink, useNavigate } from "react-router-dom";

const Navbar = () => {
  const { token, setToken, userData, setUserData } = useContext(AppContext);
  const navigate = useNavigate();
  const logout = () => {
    setToken(false);
    localStorage.removeItem("token");
  };

  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <div className="Navbar-container container-xl ">
      <div
        onClick={() => navigate("/")}
        style={{ cursor: "pointer" }}
        className="Navbar-left-content"
      >
        <i className="fa-solid fa-heart"></i>
        <div className="Navbar-logo">HeartNote</div>
      </div>
      <div className="Navbar-right-content">
        <div className="Navbar-notification">
          <i className="fa-solid fa-bell"></i>
        </div>
        <div className="Navbar-user-container">
          {token && userData ? (
            <>
              <div
                className="Navbar-user"
                onClick={() => {
                  setShowDropdown(!showDropdown);
                }}
              >
                <i className="fa-solid fa-user"></i>
              </div>
              <ul
                className="Dropdown-user"
                style={!showDropdown ? { display: "none" } : { display: "" }}
              >
                <li>Profile</li>
                <li onClick={logout}>Logout</li>
              </ul>
            </>
          ) : (
            <div
              onClick={() => {
                setToken("");
                navigate("/login");
              }}
              className="Navbar-login"
            >
              Đăng nhập
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
