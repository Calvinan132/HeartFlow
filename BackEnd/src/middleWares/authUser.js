import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const authUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.json({ message: "Không có token, vui lòng đăng nhập!" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();
  } catch (error) {
    console.error("Lỗi xác thực token:", error.message);
    res.status(401).json({ message: "Token không hợp lệ hoặc đã hết hạn!" });
  }
};

export default authUser;
