import authSocket from "../middleWares/authSocket.js";
import handleConnection from "../controllers/chatController.js";
export const onlineUsers = new Map();

let io;

let setupSocketIO = (server) => {
  io = server;
  io.use(authSocket);
  io.on("connection", (socket) => {
    socket.join(socket.userId);

    handleConnection(io, socket);
  });
};

const getIO = () => {
  if (!io) {
    throw new Error(
      "Socket.IO not initialized! Call initSocket(httpServer) first."
    );
  }
  return io;
};

export { setupSocketIO, getIO };
