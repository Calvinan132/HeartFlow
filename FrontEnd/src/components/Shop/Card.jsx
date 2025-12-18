import "./Card.scss";
import { Link } from "react-router-dom";
let Card = ({ products }) => {
  return (
    <>
      {products.map((item) => {
        return (
          <div className="col-6 col-lg-3" key={item.id}>
            <Link
              to={`/product/${item.id}`}
              style={{ textDecoration: "none", color: "black" }}
            >
              <div className="Product">
                <img className="Picture" src={item.image_url} alt={item.name} />
                <div className="Info">
                  <div className="Name">{item.name}</div>
                  <div className="Rate">
                    <b>
                      5.0<i className="fa-solid fa-star"></i>
                    </b>
                  </div>
                  <div className="Price">
                    <b>Giá: </b>
                    {item.price}
                  </div>
                </div>
              </div>
            </Link>
          </div>
        );
      })}
    </>
  );
};

export default Card;
