import express from "express";
import {
  listFriend,
  pending,
  pendingCheck,
  request,
  response,
  unfriend,
} from "../controllers/friendController.js";
import authUser from "../middleWares/authUser.js";

let friendRouter = express.Router();

friendRouter.post("/request", authUser, request);
friendRouter.put("/response", authUser, response);
friendRouter.get("/listFriend", authUser, listFriend);
friendRouter.get("/pending", authUser, pending);
friendRouter.get("/pendingcheck", authUser, pendingCheck);
friendRouter.post("/unfriend", authUser, unfriend);

export default friendRouter;
