import express from "express";
import {
  request,
  check,
  response,
  setDate,
  loadDate,
} from "../controllers/partnerController.js";
import authUser from "../middleWares/authUser.js";

let partnerRouter = express.Router();

partnerRouter.post("/request", authUser, request);
partnerRouter.get("/check", authUser, check);
partnerRouter.put("/response", authUser, response);
partnerRouter.put("/setdate", authUser, setDate);
partnerRouter.get("/loaddate", authUser, loadDate);

export default partnerRouter;
