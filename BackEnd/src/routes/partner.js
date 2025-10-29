import express from "express";
import { request, check, response } from "../controllers/partnerController.js";
import authUser from "../middleWares/authUser.js";

let partnerRouter = express.Router();

partnerRouter.post("/request", authUser, request);
partnerRouter.get("/check", authUser, check);
partnerRouter.put("/response", authUser, response);

export default partnerRouter;
