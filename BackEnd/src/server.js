import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { testConnection } from "./config/db.js";
import connectCloudinary from "./config/cloudinary.js";
// Router
import userRouter from "./routes/userRoute.js";
import friendRouter from "./routes/friendRoute.js";
import partnerRouter from "./routes/partnerRouter.js";
import shopRouter from "./routes/shopRouter.js";

import { setupSocketIO } from "./config/socket.js";
dotenv.config();

let app = express();
let port = process.env.PORT || 4000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
connectCloudinary();
// Router
app.use("/api/user", userRouter);
app.use("/api/friend", friendRouter);
app.use("/api/partner", partnerRouter);
app.use("/api/shop", shopRouter);
// chat
import http from "http";
import { Server } from "socket.io";
// Tạo server HTTP từ app Express
const server = http.createServer(app);

// Tạo Socket.IO server
const io = new Server(server, {
  cors: { origin: process.env.VITE_URL },
});

setupSocketIO(io);

// Chỉ listen **server**, không dùng app.listen nữa
server.listen(port, async () => {
  console.log(`Server started on PORT:${port}`);
  await testConnection();
});
