import Sidebar from "../components/SideBar";
import PopupAddMemory from "../components/PopupAddMemory";
import "./Memories.scss";
import { useState, useMemo, useContext } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

let findClosestUpcomingEvent = (arrEvent) => {
  if (!arrEvent || arrEvent.length === 0) {
    return null;
  }

  const oneDayInMs = 1000 * 60 * 60 * 24;
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const currentYear = now.getFullYear();

  // 1. Tính toán số ngày "sắp đến" cho MỌI sự kiện
  const eventsWithDiff = arrEvent.map((event) => {
    const date = new Date(event.created_at);
    const targetMonth = date.getMonth(); // 0-11
    const targetDay = date.getDate();

    const anniversaryThisYear = new Date(currentYear, targetMonth, targetDay);
    anniversaryThisYear.setHours(0, 0, 0, 0);

    const anniversaryNextYear = new Date(
      currentYear + 1,
      targetMonth,
      targetDay
    );
    anniversaryNextYear.setHours(0, 0, 0, 0);

    const diffThisYearMs = anniversaryThisYear.getTime() - now.getTime();
    const diffNextYearMs = anniversaryNextYear.getTime() - now.getTime();

    const diffThisYearDays = Math.round(diffThisYearMs / oneDayInMs);
    const diffNextYearDays = Math.round(diffNextYearMs / oneDayInMs);

    // 2. Chọn mốc kỉ niệm "sắp đến" (luôn là số >= 0)
    // Nếu kỉ niệm năm nay đã qua (số âm), thì dùng kỉ niệm năm sau.
    const upcomingDiff =
      diffThisYearDays >= 0 ? diffThisYearDays : diffNextYearDays;

    return {
      event: event,
      upcomingDiff: upcomingDiff,
    };
  });

  // 3. Sắp xếp mảng để tìm ra sự kiện có số ngày "sắp đến" nhỏ nhất
  eventsWithDiff.sort((a, b) => a.upcomingDiff - b.upcomingDiff);

  // 4. Trả về sự kiện đầu tiên (gần nhất)
  return eventsWithDiff[0].event;
};

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
    } catch (e) {
      console.error("PUT error:", e.response?.data || e);
    }
  };

  function tinhSoNgayDenHangNam(input) {
    const date = new Date(input);
    const ngay = date?.getDate();
    const thang = date?.getMonth() + 1;
    const MS_MOT_NGAY = 1000 * 60 * 60 * 24;
    const homNay = new Date();

    // 1. Chuẩn hóa 'hôm nay' về 00:00:00 UTC
    const namHienTai = homNay.getFullYear();
    const utcHomNay = Date.UTC(namHienTai, homNay.getMonth(), homNay.getDate());

    // 2. Tạo ngày đích cho NĂM NAY
    //    Lưu ý: Tháng trong JavaScript bắt đầu từ 0 (tháng 0 = tháng 1)
    //    nên chúng ta phải (thang - 1)
    let utcNgayDich = Date.UTC(namHienTai, thang - 1, ngay);

    // 3. KIỂM TRA QUAN TRỌNG:
    //    Nếu ngày đích của năm nay đã trôi qua (utcNgayDich < utcHomNay),
    //    thì chúng ta phải tính cho ngày đó của NĂM SAU.
    if (utcNgayDich < utcHomNay) {
      utcNgayDich = Date.UTC(namHienTai + 1, thang - 1, ngay);
    }

    // 4. Tính chênh lệch
    return Math.floor((utcNgayDich - utcHomNay) / MS_MOT_NGAY);
  }

  const event = findClosestUpcomingEvent(memories);

  console.log(tinhSoNgayDenHangNam(event?.created_at));
  return (
    <div className="Memories-container container-fluid">
      <div className="Memories-content row pt-3">
        <div className="Memories-left d-none d-md-flex col-md-3">
          <Sidebar />
        </div>
        <div className="Memories-mid col-12 col-md-6 ">
          <PopupAddMemory></PopupAddMemory>
          <div className="Memories-title col-12">
            <b>Hồ Sơ Kỷ Niệm</b>
          </div>
          <div className="Memories-remind">
            <div className="Memory">
              <div className="Memory-date">{ddmmyy(event?.created_at)}</div>
              <div className="Memory-title">
                <b>{event?.title}</b>
              </div>
              <div className="Memory-content">{event?.content}</div>
              <div className="Memory-sign">{getUsername(event?.user_id)}</div>
              <div className="Memory-edit"></div>
            </div>
            <div className="Remaining">
              Còn {tinhSoNgayDenHangNam(event?.created_at)} ngày
            </div>
          </div>
          <div className="Memory-container col-12">
            <div className="Memories-box row gap-3 p-md-0 ">
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
        <div className="Memories-right d-none d-md-flex col-md-3">
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
