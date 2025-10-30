import Sidebar from "../components/SideBar";
import PopupAddMemory from "../components/PopupAddMemory";
import "./Memories.scss";
import { useState, useEffect, useContext } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const Memories = () => {
  const { token, userData, allUser, isShowPopup, setShowPopup } =
    useContext(AppContext);
  const { memories, loadMemories } = useContext(AppContext);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  const allUsersList = allUser ?? [];
  const getUsername = (id) => {
    if (id === userData.id) return "You";
    const user = allUsersList.find((u) => u.id === id);
    return user ? user.username : `User ${id}`;
  };

  // dd/mm/yy

  const ddmmyy = (dateStr) => {
    return dateStr?.split("-").reverse().join("/");
  };

  const handleEditClick = (item) => {
    setEditingId(item.MemoryId);
    setEditData({ ...item });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (id) => {
    try {
      await axios.put(`${backendUrl}/api/user/update-memory/${id}`, editData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEditingId(null);
      loadMemories();
      console.log(editData.created_at);
    } catch (e) {
      console.error("PUT error:", e.response?.data || e);
    }
  };

  let findUpcomingEvents = (arrEvent, daysInAdvance = 7) => {
    const oneDayInMs = 1000 * 60 * 60 * 24;

    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const currentYear = now.getFullYear();

    return arrEvent.filter((event) => {
      const date = new Date(event.created_at);
      const targetMonth = date.getMonth(); // 0-11
      const targetDay = date.getDate();

      // Tạo mốc kỉ niệm năm nay
      const anniversaryThisYear = new Date(currentYear, targetMonth, targetDay);
      anniversaryThisYear.setHours(0, 0, 0, 0);

      // Tạo mốc kỉ niệm năm sau (để xử lý cuối năm)
      const anniversaryNextYear = new Date(
        currentYear + 1,
        targetMonth,
        targetDay
      );
      anniversaryNextYear.setHours(0, 0, 0, 0);

      // Tính khoảng cách (KHÔNG dùng Math.abs)
      // (Nếu là tương lai, diff sẽ >= 0)
      const diffThisYearMs = anniversaryThisYear.getTime() - now.getTime();
      const diffNextYearMs = anniversaryNextYear.getTime() - now.getTime();

      // Làm tròn để tránh lỗi múi giờ
      const diffThisYearDays = Math.round(diffThisYearMs / oneDayInMs);
      const diffNextYearDays = Math.round(diffNextYearMs / oneDayInMs);

      // Kiểm tra xem kỉ niệm năm NAY có "sắp đến" không
      const isUpcomingThisYear =
        diffThisYearDays >= 0 && diffThisYearDays <= daysInAdvance;

      // Kiểm tra xem kỉ niệm năm SAU có "sắp đến" không (trường hợp cuối năm)
      const isUpcomingNextYear =
        diffNextYearDays >= 0 && diffNextYearDays <= daysInAdvance;

      return isUpcomingThisYear || isUpcomingNextYear;
    });
  };
  console.log(findUpcomingEvents(memories));
  return (
    <div className="Memories-container container-fluid">
      <div className="Memories-content row pt-3">
        <div className="Memories-left col-3">
          <Sidebar />
        </div>
        <div className="Memories-mid col-6 row">
          <PopupAddMemory></PopupAddMemory>
          <div className="Memories-title col-12">
            <b>Hồ Sơ Kỷ Niệm Của Chúng Ta</b>
          </div>
          <div className="Memories-remind">
            <div className="Memory">
              <div className="Memory-date">1/1/1</div>
              <div className="Memory-title">
                <b>title</b>
              </div>
              <div className="Memory-content">hello</div>
              <div className="Memory-sign">An</div>
              <div className="Memory-edit"></div>
            </div>
          </div>
          <div className="Memory-container col-12">
            <div className="Memories-box row gap-3">
              <div className="x">Dòng thời gian</div>
              {memories?.map((item) => {
                const isEditing = editingId === item.MemoryId;
                return (
                  <div className="Memory" key={item.MemoryId}>
                    {isEditing ? (
                      <>
                        <input
                          className="Date-input"
                          type="text"
                          name="create_at"
                          value={
                            editData.created_at
                              ? ddmmyy(editData.created_at)
                              : ""
                          }
                          placeholder="dd/mm/yy"
                          onChange={(e) => {
                            const value = e.target.value;
                            const parts = value.split("/");
                            if (parts.length === 3) {
                              const [d, m, y] = parts;
                              const isoDate = `${y}-${m.padStart(
                                2,
                                "0"
                              )}-${d.padStart(2, "0")}`;
                              setEditData((prev) => ({
                                ...prev,
                                created_at: isoDate,
                              }));
                            } else {
                              setEditData((prev) => ({
                                ...prev,
                                created_at: value,
                              }));
                            }
                          }}
                        ></input>
                        <input
                          type="text"
                          name="title"
                          value={editData.title}
                          onChange={handleChange}
                          placeholder="Nhập tiêu đề..."
                          className="Title-input"
                        />
                        <textarea
                          name="content"
                          value={editData.content}
                          onChange={(e) => {
                            handleChange(e); // cập nhật state
                            e.target.style.height = "auto"; // reset chiều cao
                            e.target.style.height =
                              e.target.scrollHeight + "px"; // set lại theo nội dung
                          }}
                          placeholder="Nhập nội dung..."
                          className="Content-input"
                        />
                        <div className="Memory-actions">
                          <button
                            className="btn btn-success"
                            onClick={() => handleSave(item.MemoryId)}
                          >
                            Lưu
                          </button>
                          <button
                            className="btn btn-secondary"
                            onClick={() => setEditingId(null)}
                          >
                            Hủy
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="Memory-date">
                          {ddmmyy(item.created_at)}
                        </div>
                        <div className="Memory-title">
                          <b>{item.title}</b>
                        </div>
                        <div className="Memory-content">{item.content}</div>
                        <div className="Memory-sign">
                          {getUsername(item.user_id)}
                        </div>
                        <div className="Memory-edit">
                          <i
                            className="fa-solid fa-pen-to-square"
                            onClick={() => handleEditClick(item)}
                          ></i>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="Memories-right col-3">
          <div className="content-container">
            <div
              className="Add-memory"
              onClick={() => {
                setShowPopup(!isShowPopup);
              }}
            >
              <i className="fa-solid fa-plus"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Memories;
