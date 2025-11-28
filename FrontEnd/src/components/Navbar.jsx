import "./Navbar.scss";
import React, { useContext, useState, loadUserData, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import { NavLink, useNavigate, Link } from "react-router-dom";
import Notification from "./Notification";

const Navbar = () => {
  const { token, setToken, userData, setUserData, CartBadge } =
    useContext(AppContext);
  const navigate = useNavigate();
  const logout = () => {
    setToken(false);
    localStorage.removeItem("token");
    setUserData(false);
  };

  const [showDropdown, setShowDropdown] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  return (
    <nav className="Navbar-container container-xl navbar-expand-md ">
      <div className="Navbar-left-content">
        <div className="left-container" onClick={() => navigate("/")}>
          <i className="fa-solid fa-heart"></i>
          <div className="Navbar-logo">HeartNote</div>
        </div>
      </div>
      <div className="Navbar-right-content ">
        <div className="Navbar-notification">
          <i
            style={{ cursor: "pointer" }}
            className="fa-solid fa-bell"
            onClick={() => setShowNotification(!showNotification)}
          ></i>
          <div style={showNotification ? {} : { display: "none" }}>
            <Notification></Notification>
          </div>
        </div>
        <NavLink to={"/cart"} className="Navbar-cart">
          <span className="cart-badge">{CartBadge}</span>
          <i className="fa-solid fa-cart-shopping"></i>
        </NavLink>
        <div className="Navbar-user-container collapse navbar-collapse">
          {token && userData ? (
            <>
              <div
                className="Navbar-user"
                onClick={() => {
                  setShowDropdown(!showDropdown);
                }}
              >
                {userData?.image_url ? (
                  <img src={userData?.image_url} className="img-avt"></img>
                ) : (
                  <i className="fa-solid fa-user img-avt"></i>
                )}
              </div>
              <ul
                className="Dropdown-user"
                style={!showDropdown ? { display: "none" } : { display: "" }}
              >
                <li
                  onClick={() => {
                    navigate("/editprofile");
                  }}
                >
                  Profile
                </li>
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
      <button
        className="navbar-toggler"
        type="button"
        onClick={() => {
          setShowSidebar(!showSidebar);
        }}
      >
        <i className="fa-solid fa-bars" style={{ fontWeight: "bold" }}></i>
      </button>
      <div
        className="Popup-sidebar "
        onClick={() => {
          setShowSidebar(!showSidebar);
        }}
        style={showSidebar ? {} : { display: "none" }}
      >
        <div
          className="Popup-sidebar-content"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <i
            className="close fa-solid fa-xmark"
            onClick={() => {
              setShowSidebar(!showSidebar);
            }}
          ></i>
          {!userData ? (
            <div className="Login">
              <div onClick={() => navigate("/login")}>Đăng nhập</div>
            </div>
          ) : (
            <div className="info">
              <img className="avt" src={userData?.image_url}></img>
              <div className="name">
                {userData?.lastname + " " + userData?.firstname}
              </div>
            </div>
          )}
          <div className="Sidebar-Container">
            <NavLink to="/" className="Sidebar-Content">
              <i className="fa-solid fa-house"></i>Home
            </NavLink>
            <NavLink to="/chat" className="Sidebar-Content">
              <i className="fa-solid fa-comment"></i>Chat
            </NavLink>
            <NavLink to="/Memories" className="Sidebar-Content">
              <i className="fa-solid fa-book-open"></i>Memories
            </NavLink>
            <NavLink to="/shop" className="Sidebar-Content">
              <i className="fa-solid fa-shop"></i>Shop
            </NavLink>
            <NavLink to="/pet" className="Sidebar-Content">
              <i className="fa-solid fa-paw"></i>Pet
            </NavLink>
            <NavLink to="/Location" className="Sidebar-Content">
              <i className="fa-solid fa-location-dot"></i>Location
            </NavLink>
            <NavLink to="/addfriends" className="Sidebar-Content">
              <i className="fa-solid fa-user-plus"></i>Friends
            </NavLink>
          </div>
          {userData ? (
            <div className="Logout" onClick={logout}>
              <b>Đăng xuất</b>
              <i className="fa-solid fa-arrow-right-to-bracket"></i>
            </div>
          ) : null}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
