import "./Shop.scss";
import Sidebar from "../components/Sidebar";
import Card from "../components/Shop/Card";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { useSelector, useDispatch } from "react-redux";
import {
  loadCart,
  selectCartTotalAmount,
} from "../redux/features/slices/shopSlice/cartSlice";

let Shop = () => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const { backendUrl, token } = useContext(AppContext);
  const cart = useSelector((state) => state.cart.cartList);
  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await axios.get(
          backendUrl + `/api/shop/products?page=${page}&limit=4`
        );
        const data = response.data;
        setProducts((prev) => [...prev, ...data.data]);
      } catch (err) {
        if (err.response) {
          console.error("Lỗi API:", err.response.data.message || err.message);
        } else if (err.request) {
          console.error("Không thể kết nối đến server:", err.message);
        } else {
          console.error("Lỗi:", err.message);
        }
      }
    }
    fetchProducts();
  }, [page]);

  const dispatch = useDispatch();
  useEffect(() => {
    if (token) {
      dispatch(loadCart({ token, backendUrl }));
    }
  }, [token, dispatch, backendUrl]);

  const totalPrice = useSelector(selectCartTotalAmount);
  return (
    <div className="Shop-container container-fluid">
      <div className="Shop-content row pt-3">
        <div className="Left-content d-none d-md-flex col-md-3">
          <Sidebar></Sidebar>
        </div>
        <div className="Mid-content col-12 col-md-6">
          <div className="Header"></div>
          <div className="Search">
            <i className="fa-solid fa-magnifying-glass"></i>
          </div>
          <div className="Title">
            <b>Sản phẩm nổi bật</b>
          </div>
          <div className="container py-4">
            <div className="Products row g-3 ">
              <Card products={products}></Card>
            </div>
            <button
              className="Load-more btn btn-outline-primary mt-4 d-block mx-auto"
              onClick={() => setPage(page + 1)}
            >
              Xem thêm
            </button>
          </div>
        </div>
        <div className="Right-content d-none d-md-flex col-md-3">
          <div className="Cart ">
            <div className="Title">
              <i className="fa-solid fa-cart-shopping"></i>
              <span>Giỏ hàng</span>
            </div>
            <div className="Products-cart">
              {cart?.length === 0 ? (
                <div>Chưa có sản phẩm nào</div>
              ) : (
                cart?.map((item, index) => {
                  return (
                    <div className="Product-cart" key={index}>
                      <img className="Picture" src={item.image_url}></img>
                      <div className="Info">
                        <div className="Name">{item?.name}</div>
                        <div className="Price">Giá: {item?.price}</div>
                        <div className="Quantity">
                          Số lượng: {item?.quantity}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
            <div className="Payment">
              <div className="Total">
                <span style={{ fontWeight: "bold" }}>Tổng: </span>
                <span className="Total-amount">{totalPrice} VND</span>
              </div>
              <div
                className="action-payment"
                onClick={() => alert("Chưa có thời gian làm, thông cảm :>")}
              >
                Thanh toán
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
