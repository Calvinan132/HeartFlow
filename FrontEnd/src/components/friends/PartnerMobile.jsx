import { useState, useContext } from "react";
import { AppContext } from "../../context/AppContext";

let PartnerMobile = () => {
  const { userData, allUser } = useContext(AppContext);
  const partner = allUser.find((user) => user.id === userData.partner);

  console.log(partner);
  return (
    <div className="container">
      <div className="P-info d-flex align-items-center mt-4">
        <img
          src={partner?.image_url}
          style={{
            width: "50px",
            height: "50px",
            borderRadius: "50%",
            border: "1px solid pink",
          }}
        ></img>
        <div
          style={{ fontSize: "large", fontWeight: "500", marginLeft: "10px" }}
        >
          {partner.lastname + " " + partner.firstname}
        </div>
      </div>
    </div>
  );
};

export default PartnerMobile;
