import "./PopupAddMemory.scss";

import { useState, useContext } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const PopupAddMemory = () => {
  const { token, isShowPopup, setShowPopup, loadMemories } =
    useContext(AppContext);

  const [memory, setMemory] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMemory((prev) => ({ ...prev, [name]: value }));
  };
  const yymmdd = (dateStr) => {
    return dateStr?.split("/").reverse().join("-");
  };

  const handleSave = async (id) => {
    try {
      const payload = {
        ...memory,
        created_at: yymmdd(memory.created_at),
      };
      await axios.post(`${backendUrl}/api/user/add-memory`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMemory({});
      setShowPopup(!isShowPopup);
      loadMemories();
    } catch (e) {
      console.error("PUT error:", e.response?.data || e);
    }
  };
  console.log(memory);
  return (
    <>
      <div
        className="Popup-container"
        style={!isShowPopup ? { display: "none" } : {}}
      >
        <div className="Popup-content">
          <div
            className="Close"
            onClick={() => {
              setShowPopup(!isShowPopup);
            }}
          >
            <i className="fa-solid fa-x"></i>{" "}
          </div>
          <div className="Input-content ">
            <div>Thêm memory:</div>
            <input
              type="text"
              className="Date-input"
              placeholder="dd/mm/yy"
              name="created_at"
              onChange={handleChange}
              value={memory.created_at || ""}
            ></input>
            <input
              type="text"
              className="Title-input"
              placeholder="Nhập tiêu đề..."
              name="title"
              onChange={handleChange}
              value={memory.title || ""}
            ></input>
            <textarea
              type="text"
              className="Content-input"
              placeholder="Nhập mô tả..."
              name="content"
              value={memory.content || ""}
              onChange={(e) => {
                handleChange(e);
                e.target.style.height = "auto"; // reset chiều cao
                e.target.style.height = e.target.scrollHeight + "px"; // set lại theo nội dung
              }}
            ></textarea>
            <button type="submit" className="Submit-input" onClick={handleSave}>
              Thêm memory
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default PopupAddMemory;
