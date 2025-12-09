import "./Sidebar.scss";
import { NavLink, useNavigate } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="Sidebar-container">
      <NavLink to="/" className="Sidebar-content">
        <i className="fa-solid fa-house"></i>Home
      </NavLink>
      <NavLink to="/chat" className="Sidebar-content">
        <i className="fa-solid fa-comment"></i>Chat
      </NavLink>
      <NavLink to="/Memories" className="Sidebar-content">
        <i className="fa-solid fa-book-open"></i>Memories
      </NavLink>
      <NavLink to="/shop" className="Sidebar-content">
        <i className="fa-solid fa-shop"></i>Shop
      </NavLink>
      <NavLink to="/pet" className="Sidebar-content">
        <i className="fa-solid fa-paw"></i>Pet
      </NavLink>
      <NavLink to="/Location" className="Sidebar-content">
        <i className="fa-solid fa-location-dot"></i>Location
      </NavLink>
      <NavLink to="/addfriends" className="Sidebar-content">
        <i className="fa-solid fa-user-plus"></i>Friends
      </NavLink>
      <NavLink to="/love" className="Sidebar-content">
        <i className="fa-solid fa-heart"></i>Love
      </NavLink>
    </div>
  );
};

export default Sidebar;
