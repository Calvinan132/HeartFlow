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
  editProfile,
  getLocation,
} from "../controllers/userController.js";

import { getNotification } from "../controllers/notificationController.js";
import authUser from "../middleWares/authUser.js";
import upload from "../middleWares/multer.js";
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
userRouter.get("/formess/:id", authUser, getUserById);
userRouter.get("/location/:id", getLocation);

userRouter.post("/editprofile", upload.single("image"), authUser, editProfile);

userRouter.get("/getnotification", authUser, getNotification);
export default userRouter;
