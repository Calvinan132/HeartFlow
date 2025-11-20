import { useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Chatting from "./pages/Chatting";
import Memories from "./pages/Memories";
import Shop from "./pages/Shop.";
import Friends from "./pages/Friends";
import Register from "./pages/Register";
import Pet from "./pages/Pet";
import Location from "./pages/Location";
import ProductDetail from "./components/Shop/ProductDetail";
import Cart from "./components/Shop/cart";

import "./App.css";
function App() {
  let location = useLocation();
  let hidenNavbar1 = location.pathname === "/login";
  let hidenNavbar2 = location.pathname === "/register";
  return (
    <div>
      {!hidenNavbar1 && !hidenNavbar2 && <Navbar />}
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/chat" element={<Chatting />} />
        <Route path="/Memories" element={<Memories />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />}></Route>
        <Route path="/addfriends" element={<Friends />} />
        <Route path="/register" element={<Register />} />
        <Route path="/pet" element={<Pet />} />
        <Route path="/Location" element={<Location />} />
      </Routes>
    </div>
  );
}

export default App;
