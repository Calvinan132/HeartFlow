import "./Cart.scss";
import { useState, useEffect } from "react";
import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

let Cart = () => {
  useEffect(() => {
    let loadCart = async () => {
      let res = await axios.get(backendUrl + "/api/shop/getCart");
      console.log(res);
    };
  }, []);
  return (
    <div className="cart-container container-fluid ">
      <div className="cart-content">
        <table className="table">
          <thead>
            <tr className="info ">
              <th className="left-info">Sản phẩm</th>
              <th>Đơn giá</th>
              <th>Số lượng</th>
              <th>Số tiền</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr className="product">
              <td className="d-flex">
                <img></img>
                <div className="name ">abc</div>
              </td>
              <td>50000 đồng </td>
              <td>50000 đồng </td>
              <td>50000 đồng </td>
              <td>50000 đồng </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Cart;
