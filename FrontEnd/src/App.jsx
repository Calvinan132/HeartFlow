import { useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/navBar";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Chatting from "./pages/Chatting";
import Memories from "./pages/Memories";
import Shop from "./pages/Shop.";
import Friends from "./pages/Friends";
import "./App.css";
function App() {
  let location = useLocation();
  let hidenNavbar = location.pathname === "/login";
  return (
    <div>
      {!hidenNavbar && <Navbar />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Dashboard />} />
        <Route path="/chat" element={<Chatting />} />
        <Route path="/Memories" element={<Memories />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/addfriends" element={<Friends />} />
      </Routes>
    </div>
  );
}

export default App;
