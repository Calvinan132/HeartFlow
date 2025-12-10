import express from "express";
import {
  request,
  check,
  response,
  setDate,
  loadDate,
  unLove,
  PartnerLocation,
} from "../controllers/partnerController.js";
import authUser from "../middleWares/authUser.js";

let partnerRouter = express.Router();

partnerRouter.post("/request", authUser, request);
partnerRouter.get("/check", authUser, check);
partnerRouter.put("/response", authUser, response);
partnerRouter.put("/setdate", authUser, setDate);
partnerRouter.get("/loaddate/:partner", authUser, loadDate);
partnerRouter.post("/unlove", authUser, unLove);
partnerRouter.get("/Partner-location", authUser, PartnerLocation);

export default partnerRouter;
