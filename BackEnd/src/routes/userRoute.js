import express from "express";
import {
  userRegister,
  userLogin,
  loadUserData,
  getAllUser,
  getMemories,
  updateMemory,
  addMemory,
  getMessage,
  getUserById,
} from "../controllers/userController.js";
import authUser from "../middleWares/authUser.js";
let userRouter = express.Router();

userRouter.post("/register", userRegister);
userRouter.post("/login", userLogin);
userRouter.get("/get-profile", authUser, loadUserData);
userRouter.get("/get-all", authUser, getAllUser);
userRouter.get("/get-memories", authUser, getMemories);
userRouter.put("/update-memory/:id", authUser, updateMemory);
userRouter.post("/add-memory", authUser, addMemory);
// API lấy tin nhắn giữa 2 user
userRouter.get("/:userId/:partnerId", getMessage);
userRouter.get("/:id", authUser, getUserById);
userRouter.get("/location/:id", getUserById);
export default userRouter;
