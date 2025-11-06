import "./Card.scss";
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AppContext } from "../../context/AppContext";

let Card = () => {
  const [products, setProducts] = useState([]);
  const { backendUrl } = useContext(AppContext);
  useEffect(() => {
    // 3. Định nghĩa hàm gọi API
    async function fetchProducts() {
      try {
        // Gọi API bằng axios
        const response = await axios.get(backendUrl + "/api/shop/products");
        const data = response.data;

        // 4. Cập nhật state với dữ liệu nhận về
        setProducts(data.data);
      } catch (err) {
        // 3. Khối catch này sẽ bắt được lỗi từ axios
        if (err.response) {
          // Lỗi do server trả về (ví dụ: 404, 503)
          console.error("Lỗi API:", err.response.data.message || err.message);
        } else if (err.request) {
          // Lỗi do không kết nối được server
          console.error("Không thể kết nối đến server:", err.message);
        } else {
          // Lỗi khác
          console.error("Lỗi:", err.message);
        }
      }
    }

    // 5. Gọi hàm
    fetchProducts();
  }, []);

  console.log(products);

  return (
    <>
      {products.map((item) => {
        return (
          // 1. Sửa key: Dùng item.id (hoặc id duy nhất) thay vì index
          <div className="col-12 col-md-6 col-lg-4">
            <div className="Product" key={item.id}>
              <img className="Picture" src={item.image_url} alt={item.name} />
              <div className="Name">{item.name}</div>
              <div className="Rate">
                <b>
                  5.0<i className="fa-solid fa-star"></i>
                </b>
                | Đã bán 1000+
              </div>
              <div className="Price">{item.price}</div>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default Card;
