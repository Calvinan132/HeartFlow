import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

let authSocket = (socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error("Không có token"));

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = user.id;
    next();
  } catch (err) {
    next(new Error("Token không đúng !"));
  }
};

export default authSocket;
