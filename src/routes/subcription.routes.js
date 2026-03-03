import express from "express";
import {
    cancelSubscription,
  getAllSubScriptionForAdmin,
  getAllSubScriptionHistory,
  getMySubScription,
  getProfitForAdmin,
} from "../controllers/subscrption.controller.js";

import { adminMiddelware, authMiddelware } from "../middlewares/authMiddelware.js";
const subScriptionRouter = express.Router();

subScriptionRouter.get("/me", authMiddelware, getMySubScription);
subScriptionRouter.get("/history", authMiddelware, getAllSubScriptionHistory);
subScriptionRouter.patch("/cancel", authMiddelware, cancelSubscription);
subScriptionRouter.get("/admin/all", adminMiddelware, getAllSubScriptionForAdmin);
subScriptionRouter.get("/admin/profit", adminMiddelware, getProfitForAdmin);
export default subScriptionRouter;
