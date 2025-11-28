import "./EditProfile.scss";
import { useContext, useState, useEffect, use } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";

let EditProfile = () => {
  const { userData, token, backendUrl } = useContext(AppContext);
  const [image, setImage] = useState(false);
  const [message, setMessage] = useState(false);
  const [info, setInfo] = useState({
    username: "",
    email: "",
    firstname: "",
    lastname: "",
    address: "",
  });

  useEffect(() => {
    if (userData) {
      // Đảm bảo chỉ khởi tạo một lần
      setInfo({
        username: userData.username || "",
        email: userData.email || "",
        firstname: userData.firstname || "",
        lastname: userData.lastname || "",
        address: userData.address || "",
      });
    }
  }, [userData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("username", info.username);
    formData.append("email", info.email);
    formData.append("firstname", info.firstname);
    formData.append("lastname", info.lastname);
    formData.append("address", info.address);

    if (image) {
      formData.append("image", image);
    }

    try {
      const { data } = await axios.post(
        backendUrl + "/api/user/editprofile",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setMessage(data);
    } catch (e) {
      console.log("lỗi từ frontend: ", e.message);
      setMessage({ success: false, message: e.message });
    }
  };
  return (
    <form
      className="Edit-profile-container container-fluid"
      onSubmit={handleSubmit}
    >
      <div className="Edit-profile-content row">
        <div className="Image col-12">
          <input
            type="file"
            id="changeIMG"
            onChange={(e) => setImage(e.target.files[0])}
            hidden
          ></input>
          <div className="avatar">
            <img
              src={image ? URL.createObjectURL(image) : userData?.image_url}
            ></img>
            <label htmlFor="changeIMG">
              <i className="fa-solid fa-pen-to-square"></i>
            </label>
          </div>
        </div>
        <div className="col-12 col-md-6 form-group">
          <label>Username:</label>
          <input
            type="text"
            className="text-input form-control"
            placeholder="Enter your username"
            value={info?.username}
            onChange={(e) => {
              setInfo((prev) => ({ ...prev, username: e.target.value }));
            }}
          ></input>
        </div>
        <div className="col-12 col-md-6 form-group">
          <label>Email:</label>
          <input
            type="email"
            className="text-input form-control"
            placeholder="Enter your username"
            value={info?.email}
            onChange={(e) => {
              setInfo((prev) => ({ ...prev, email: e.target.value }));
            }}
          ></input>
        </div>
        <div className="col-6 form-group">
          <label>Firstname: </label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter your firstname"
            value={info?.firstname}
            onChange={(e) => {
              setInfo((prev) => ({ ...prev, firstname: e.target.value }));
            }}
          ></input>
        </div>
        <div className="col-6 form-group">
          <label>Lastname: </label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter your lastname"
            value={info?.lastname}
            onChange={(e) => {
              setInfo((prev) => ({ ...prev, lastname: e.target.value }));
            }}
          ></input>
        </div>
        <div className="col-12 form-group">
          <label>Address: </label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter your lastname"
            value={info?.address}
            onChange={(e) => {
              setInfo((prev) => ({ ...prev, address: e.target.value }));
            }}
          ></input>
        </div>
        <div
          className="message col-12 mt-3 "
          style={
            message.success
              ? { backgroundColor: "green" }
              : { backgroundColor: "red" }
          }
        >
          {message.message}
        </div>
        <div className="col-12 mt-3 form-group">
          <button className="form-control">Submit</button>
        </div>
      </div>
    </form>
  );
};

export default EditProfile;
