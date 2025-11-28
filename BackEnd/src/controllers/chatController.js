import db from "../config/db.js";
import { onlineUsers } from "../config/socket.js";
let handleConnection = (io, socket) => {
  console.log("User connected:", socket.userId);
  onlineUsers.set(socket.userId, socket.id);

  // Gửi danh sách online cho tất cả client
  io.emit("update_online_users", Array.from(onlineUsers.keys()));

  // Khi gửi tin nhắn
  socket.on("send_message", async ({ receiver_id, content }) => {
    const message = {
      sender_id: socket.userId,
      receiver_id,
      content,
      created_at: new Date(),
    };

    try {
      // 1. Lưu vào MySQL
      await db.execute(
        "INSERT INTO messages (sender_id, receiver_id, content) VALUES (?, ?, ?)",
        [message.sender_id, message.receiver_id, message.content]
      );

      // 2. Gửi realtime tới receiver nếu online
      const receiverSocket = onlineUsers.get(receiver_id);
      if (receiverSocket && receiver_id !== socket.userId)
        io.to(receiverSocket).emit("receive_message", message);

      // 3. Gửi lại cho sender
      socket.emit("receive_message", message);
    } catch (err) {
      console.error("Lỗi lưu tin nhắn:", err);
    }
  });

  socket.on("disconnect", () => {
    onlineUsers.delete(socket.userId);
    console.log("User disconnected:", socket.userId); // Cập nhật lại danh sách online
    io.emit("update_online_users", Array.from(onlineUsers.keys()));
  });
};

export default handleConnection;
