import "./Cart.scss";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AppContext } from "../../context/AppContext";
import { useDispatch, useSelector } from "react-redux";
import {
  loadCart,
  removeCart,
} from "../../redux/features/slices/shopSlice/cartSlice";

let Cart = () => {
  const { backendUrl, token } = useContext(AppContext);
  //redux
  const cart = useSelector((state) => state.cart.cartList);
  const dispatch = useDispatch();

  useEffect(() => {
    if (token) {
      dispatch(loadCart({ token, backendUrl }));
    }
  }, [token, dispatch, backendUrl]);
  //

  let handleRemoveCart = async (productId) => {
    dispatch(removeCart({ token, backendUrl, productId }))
      .unwrap()
      .then(() => {
        console.log("Xóa sản phẩm thành công. Tải lại giỏ hàng...");
        dispatch(loadCart({ token: token, backendUrl: backendUrl }));
      })
      .catch((error) => {
        console.error("Lỗi khi xóa vào giỏ hàng:", error);
      });
  };
  return (
    <div className="cart-container container-fluid ">
      <div className="cart-content">
        <table className="table">
          <thead>
            <tr className="info ">
              <th className="left-info">Sản phẩm</th>
              <th>Đơn giá</th>
              <th>Số lương</th>
              <th>Số tiền</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {cart.map((item, index) => {
              return (
                <tr className="product" key={index}>
                  <td className="d-flex">
                    <img src={item.image_url}></img>
                    <div className="name ">{item.name}</div>
                  </td>
                  <td>{item.price} đồng </td>
                  <td>{item.quantity} </td>
                  <td>{item.price * item.quantity}</td>
                  <td
                    onClick={() => {
                      handleRemoveCart(item.product_id);
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    Xóa
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Cart;
