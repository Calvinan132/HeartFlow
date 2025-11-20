import "./ProductDetail.scss";
import { useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AppContext } from "../../context/AppContext";

let ProductDetail = () => {
  const { id } = useParams();
  const { backendUrl, token } = useContext(AppContext);
  const [product, setProduct] = useState(null);
  const [quantity, setquantity] = useState(1);

  const loadDetail = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/shop/products/${id}`);
      setProduct(res.data.data);
    } catch (err) {
      console.error("Lỗi tải sản phẩm", err);
    }
  };
  useEffect(() => {
    loadDetail();
  }, [id]);

  const addToCart = async () => {
    const res = await axios.post(
      backendUrl + "/api/shop/addtocart",
      {
        productId: id,
        quantity: quantity,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    alert(res.data.message);
  };

  return (
    <div className="container-fluid ProductDetail-container">
      <div className="content-detail-product flex-column flex-md-row">
        <div className="img">
          {" "}
          <img src={product?.image_url} alt="" />
        </div>
        <div className="info">
          <b className="name">{product?.name}</b>
          <div className="price">
            <b>Giá: </b>
            {product?.price}
          </div>
          <div className="description">
            <b>Mô tả sản phẩm: </b>
            {product?.description}
          </div>
          <div className="stock_quantity">
            <b>Kho: </b>
            {product?.stock_quantity}
          </div>
          <div className="set-quantity">
            <b>Số lượng: </b>
            <div
              className="minus"
              onClick={() => {
                quantity <= 1 ? "" : setquantity(quantity - 1);
              }}
            >
              -
            </div>
            <div className="quantity">{quantity}</div>
            <div
              className="plus"
              onClick={() => {
                setquantity(quantity + 1);
              }}
            >
              +
            </div>
          </div>
          <div className="act">
            <button className="btn-buy btn btn-outline-primary mt-4 mx-auto me-3">
              Mua ngay
            </button>
            <button
              className="btn-cart btn btn-outline-primary mt-4 mx-auto"
              onClick={addToCart}
            >
              Thêm giỏ hàng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
