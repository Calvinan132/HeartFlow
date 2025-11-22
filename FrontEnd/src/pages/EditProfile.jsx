import React, { useState, useEffect } from "react";
// Đã loại bỏ import 'lucide-react' vì dự án sử dụng Font Awesome cho icon
// Các biểu tượng hiện tại sử dụng class CSS của Font Awesome (ví dụ: fa-solid fa-save)

// Dữ liệu giả định (Mock Data)
const mockUserProfile = {
  username: "ModernLover_99",
  firstname: "Quốc",
  lastname: "Bảo",
  image: "https://placehold.co/400x400/F472B6/ffffff?text=Modern+User",
  address: "Hà Nội, Việt Nam",
  birthday: "1999-09-05", // Format YYYY-MM-DD cho input type="date"
  bio: "Cuộc đời là một chuyến phiêu lưu, và tôi muốn tìm một người đồng hành. Yêu thích cà phê, du lịch và những đêm nhạc Acoustic.",
  relationshipStatus: "Đang hẹn hò",
};

const EditProfile = () => {
  // State chứa dữ liệu form
  const [formData, setFormData] = useState(mockUserProfile);
  const [loading, setLoading] = useState(false);
  // >> SỬA LỖI: Thêm khai báo statusMessage và setStatusMessage
  const [statusMessage, setStatusMessage] = useState({ type: "", text: "" }); // {type: 'success' | 'error', text: 'message'}
  // ... (phần code còn lại giữ nguyên)

  // Hàm xử lý thay đổi input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Hàm xử lý lưu form
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage({ type: "", text: "" });

    // Giả lập API call
    setTimeout(() => {
      setLoading(false);
      // Giả lập lưu thành công
      setStatusMessage({
        type: "success",
        text: "Lưu hồ sơ thành công! Dữ liệu đã được cập nhật.",
      });
      // Giả lập lưu thất bại
      // setStatusMessage({ type: 'error', text: 'Lỗi: Không thể kết nối tới server.' });
    }, 1500);
  };

  // Hàm chọn ảnh
  const handleImageUpload = () => {
    alert(
      "Chức năng tải ảnh chưa được cài đặt. Vui lòng sử dụng tính năng File Input thực tế."
    );
  };

  const getMessageClasses = (type) => {
    switch (type) {
      case "success":
        return "alert-success border-success";
      case "error":
        return "alert-danger border-danger";
      default:
        return "";
    }
  };

  return (
    // Sử dụng class Bootstrap cho container và căn giữa
    <div className="bg-light min-vh-100 py-5 d-flex align-items-center justify-content-center">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8 col-md-10">
            {/* Card chứa Form */}
            <form
              onSubmit={handleSubmit}
              className="card shadow-lg border-top border-4 border-pink-400"
            >
              <div className="card-body p-4 p-md-5">
                <h2 className="card-title text-center text-md-start mb-4 fs-3 fw-bold text-gray-800">
                  <i className="fa-solid fa-save text-pink-500 me-2"></i> Cập
                  Nhật Hồ Sơ
                </h2>

                {/* Message Box (Alert Bootstrap) */}
                {statusMessage.text && (
                  <div
                    className={`alert ${getMessageClasses(
                      statusMessage.type
                    )} d-flex justify-content-between align-items-center border-start-0 border-end-0 border-bottom-0`}
                    role="alert"
                  >
                    <span>{statusMessage.text}</span>
                    <button
                      type="button"
                      className="btn-close"
                      aria-label="Close"
                      onClick={() => setStatusMessage({ type: "", text: "" })}
                    ></button>
                  </div>
                )}

                {/* Avatar và Username Display - Responsive Block */}
                <div className="d-flex flex-column flex-sm-row align-items-center mb-4 p-3 bg-pink-100 rounded-3">
                  <div className="position-relative me-0 me-sm-4 mb-3 mb-sm-0">
                    <img
                      className="rounded-circle object-fit-cover shadow-sm"
                      style={{
                        width: "90px",
                        height: "90px",
                        border: "3px solid #fff",
                      }}
                      src={formData.image}
                      alt="Avatar"
                    />
                    {/* Nút upload ảnh overlay */}
                    <button
                      type="button"
                      onClick={handleImageUpload}
                      className="btn btn-sm btn-light position-absolute top-100 start-100 translate-middle rounded-circle shadow"
                      aria-label="Tải ảnh đại diện"
                      style={{
                        backgroundColor: "#F06292",
                        borderColor: "#F06292",
                        color: "#fff",
                      }}
                    >
                      <i className="fa-solid fa-camera"></i>
                    </button>
                  </div>

                  <div className="text-center text-sm-start">
                    <h3 className="fs-5 fw-bold text-gray-800">
                      {formData.lastname} {formData.firstname}
                    </h3>
                    <p className="mb-1 text-pink-600">
                      <i className="fa-solid fa-user me-1"></i> @
                      {formData.username}
                    </p>
                    <button
                      type="button"
                      className="btn btn-link btn-sm p-0 text-decoration-none"
                      onClick={handleImageUpload}
                    >
                      Thay đổi ảnh đại diện
                    </button>
                  </div>
                </div>

                {/* Form Fields - Grid Responsive (Bootstrap Row/Col) */}
                <div className="row g-4">
                  {/* Firstname */}
                  <div className="col-sm-6">
                    <InputField
                      label="Tên (First Name)"
                      id="firstname"
                      name="firstname"
                      type="text"
                      value={formData.firstname}
                      onChange={handleChange}
                      IconClass="fa-solid fa-envelope"
                    />
                  </div>

                  {/* Lastname */}
                  <div className="col-sm-6">
                    <InputField
                      label="Họ (Last Name)"
                      id="lastname"
                      name="lastname"
                      type="text"
                      value={formData.lastname}
                      onChange={handleChange}
                      IconClass="fa-solid fa-envelope"
                    />
                  </div>

                  {/* Birthday */}
                  <div className="col-sm-6">
                    <InputField
                      label="Ngày sinh"
                      id="birthday"
                      name="birthday"
                      type="date"
                      value={formData.birthday}
                      onChange={handleChange}
                      IconClass="fa-solid fa-cake-candles"
                    />
                  </div>

                  {/* Relationship Status - Select Input */}
                  <div className="col-sm-6">
                    <div className="mb-3">
                      <label
                        className="form-label fw-medium"
                        htmlFor="relationshipStatus"
                      >
                        Trạng thái quan hệ
                      </label>
                      <div className="input-group">
                        <span className="input-group-text bg-light text-pink-500">
                          <i className="fa-solid fa-heart"></i>
                        </span>
                        <select
                          id="relationshipStatus"
                          name="relationshipStatus"
                          value={formData.relationshipStatus}
                          onChange={handleChange}
                          className="form-select"
                        >
                          <option value="Độc thân vui vẻ">
                            Độc thân vui vẻ
                          </option>
                          <option value="Đang hẹn hò">Đang hẹn hò</option>
                          <option value="Đã kết hôn">Đã kết hôn</option>
                          <option value="Tìm kiếm">Tìm kiếm</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Address - Full Width */}
                  <div className="col-12">
                    <InputField
                      label="Địa chỉ"
                      id="address"
                      name="address"
                      type="text"
                      value={formData.address}
                      onChange={handleChange}
                      IconClass="fa-solid fa-location-dot"
                    />
                  </div>

                  {/* Bio - Full Width */}
                  <div className="col-12">
                    <div className="mb-3">
                      <label className="form-label fw-medium" htmlFor="bio">
                        Giới thiệu bản thân (Bio)
                      </label>
                      <textarea
                        id="bio"
                        name="bio"
                        rows="3"
                        value={formData.bio}
                        onChange={handleChange}
                        className="form-control"
                        maxLength="250"
                      ></textarea>
                      <div className="form-text text-end">Tối đa 250 ký tự</div>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="mt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-pink w-100 py-2 fs-5 fw-bold d-flex align-items-center justify-content-center"
                    style={{
                      backgroundColor: "#F06292",
                      borderColor: "#F06292",
                      color: "#fff",
                    }} // Custom Pink
                  >
                    {loading ? (
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                    ) : (
                      <i className="fa-solid fa-floppy-disk me-2"></i>
                    )}
                    {loading ? "Đang lưu..." : "Lưu Thay Đổi"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Custom CSS (Giả lập Bootstrap 5 Customization) */}
      <style>
        {`
                .border-pink-400 {
                    border-color: #F06292 !important;
                }
                .text-pink-500 {
                    color: #F06292 !important;
                }
                .bg-pink-100 {
                    background-color: #FCE4EC !important;
                }
                .btn-pink:hover {
                    background-color: #EC407A !important;
                    border-color: #EC407A !important;
                }
            `}
      </style>
    </div>
  );
};

// Component con tái sử dụng cho Input Field
const InputField = ({ label, id, name, type, value, onChange, IconClass }) => (
  <div className="mb-3">
    <label className="form-label fw-medium" htmlFor={id}>
      {label}
    </label>
    <div className="input-group">
      <span className="input-group-text bg-light text-pink-500">
        <i className={IconClass}></i>
      </span>
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        className="form-control"
        required
      />
    </div>
  </div>
);

export default EditProfile;
