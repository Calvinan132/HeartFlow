import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const AppContext = createContext();

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const AppContextProvider = (props) => {
  const [token, setToken] = useState(
    localStorage.getItem("token") ? localStorage.getItem("token") : ""
  );

  const [userData, setUserData] = useState(false);
  const [allUser, setAllUser] = useState([]);
  let loadUserData = async () => {
    try {
      let { data } = await axios.get(backendUrl + "/api/user/get-profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        setUserData(data.profile[0][0]);
      } else {
        console.log("Lỗi gì đó !", data.message);
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (token) {
      loadUserData();
    }
  }, [token]);

  let getAllUser = async () => {
    try {
      let { data } = await axios.get(backendUrl + "/api/user/get-all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        setAllUser(data.allUser[0]);
      } else {
        console.log("Lỗi gì đó !", data.message);
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (token) {
      getAllUser();
    }
  }, [token]);

  const [isShowPopup, setShowPopup] = useState(false);

  const [memories, setMemories] = useState([]);
  const loadMemories = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/get-memories`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        setMemories(data.memories);
      } else {
        console.log("Lỗi gì đó!", data.message);
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (token) {
      loadMemories();
    }
  }, [token]);

  const [cart, setCart] = useState([]);

  let loadCart = async () => {
    try {
      let res = await axios.get(backendUrl + "/api/shop/getCart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart(res.data.cart);
    } catch (e) {
      console.log("lỗi frontend: ", e);
    }
  };

  const [CartBadge, setCartBadge] = useState(0);

  let calcCartBadge = (arr) => {
    return arr.reduce((acc, curr) => {
      const quantity = curr.quantity;
      return acc + quantity;
    }, 0);
  };
  useEffect(() => {
    if (token) {
      loadCart();
    } else {
      setCart([]); // Reset giỏ hàng khi đăng xuất
    }
  }, [token]);

  useEffect(() => {
    setCartBadge(calcCartBadge(cart));
  }, [cart]);
  const value = {
    token,
    setToken,
    userData,
    setUserData,
    loadUserData,
    backendUrl,
    allUser,
    isShowPopup,
    setShowPopup,
    memories,
    setMemories,
    loadMemories,
    cart,
    CartBadge,
    loadCart,
  };
  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export default AppContextProvider;
