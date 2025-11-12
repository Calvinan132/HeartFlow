import "./Navbar.scss";
import React, { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import { NavLink, useNavigate } from "react-router-dom";

const Navbar = () => {
  const { token, setToken, userData } = useContext(AppContext);
  const navigate = useNavigate();
  const logout = () => {
    setToken(false);
    localStorage.removeItem("token");
  };

  const [showDropdown, setShowDropdown] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <div className="Navbar-container container-xl navbar-expand-md ">
      <div
        onClick={() => navigate("/")}
        style={{ cursor: "pointer" }}
        className="Navbar-left-content"
      >
        <i className="fa-solid fa-heart"></i>
        <div className="Navbar-logo">HeartNote</div>
      </div>
      <div className="Navbar-right-content collapse navbar-collapse">
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
          <div className="info">
            <img className="avt" src={userData?.image_url}></img>
            <div className="name">Hoài An</div>
          </div>
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
        </div>
      </div>
    </div>
  );
};

export default Navbar;
