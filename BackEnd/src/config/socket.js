import authSocket from "../middleWares/authSocket.js";
import handleConnection from "../controllers/chatController.js";
export const onlineUsers = new Map();

export let setupSocketIO = (io) => {
  io.use(authSocket);

  io.on("connection", (socket) => {
    handleConnection(io, socket);
  });
};
