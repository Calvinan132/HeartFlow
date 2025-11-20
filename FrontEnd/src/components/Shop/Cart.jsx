import "./Cart.scss";
let Cart = () => {
  return (
    <div className="cart-container container-fluid ">
      <div className="cart-content">
        <table className="table">
          <tr className="info ">
            <th className="left-info">Sản phẩm</th>
            <th>Đơn giá</th>
            <th>Số lượng</th>
            <th>Số tiền</th>
            <th>Thao tác</th>
          </tr>
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
        </table>
      </div>
    </div>
  );
};

export default Cart;
