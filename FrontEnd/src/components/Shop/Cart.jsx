import "./Cart.scss";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AppContext } from "../../context/AppContext";

let Cart = () => {
  const { cart, backendUrl, token, loadCart } = useContext(AppContext);
  let handleRemoveCart = async (productId) => {
    try {
      const res = await axios.delete(
        `${backendUrl}/api/shop/removecart/${productId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      loadCart();
    } catch (e) {
      console.log("lỗi từ frontend: ", e);
    }
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
