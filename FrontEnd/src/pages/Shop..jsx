import "./Shop.scss";
import Sidebar from "../components/SideBar";
import Card from "../components/Shop/Card";
let Shop = () => {
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
            <div className="Products row  g-3 ">
              <Card></Card>
            </div>
          </div>
        </div>
        <div className="Right-content d-none d-md-flex col-md-3">
          <div className="Cart">
            <div className="Title">
              <i className="fa-solid fa-cart-shopping"></i>
              <span>Giỏ hàng</span>
            </div>
            <div className="Products">
              <div className="Product">
                <div className="Picture"></div>
                <div className="Info">
                  <div className="Name">Iphone 18 Pro Max</div>
                  <div className="Quantity">Số lượng: 15</div>
                  <div className="Price">Giá: 50.000.000</div>
                </div>
              </div>
              <div className="Product">
                <div className="Picture"></div>
                <div className="Info">
                  <div className="Name">Iphone 18 Pro Max</div>
                  <div className="Quantity">Số lượng: 15</div>
                  <div className="Price">Giá: 50.000.000</div>
                </div>
              </div>
            </div>
            <div className="Payment">Thanh toán</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
