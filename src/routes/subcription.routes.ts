import express from "express";
import {
  cancelSubscription,
  getAllSubScriptionForAdmin,
  getAllSubScriptionHistory,
  getMySubScription,
  getProfitForAdmin,
} from "../controllers/subscrption.controller.js";

import {
  adminMiddelware,
  authMiddelware,
} from "../middlewares/authMiddelware.js";
const subScriptionRouter = express.Router();

subScriptionRouter.get("/me", authMiddelware, getMySubScription);
subScriptionRouter.get("/history", authMiddelware, getAllSubScriptionHistory);
subScriptionRouter.patch("/cancel", authMiddelware, cancelSubscription);
subScriptionRouter.get(
  "/admin/all",
  authMiddelware,
  adminMiddelware,
  getAllSubScriptionForAdmin,
);
subScriptionRouter.get(
  "/admin/profit",
  authMiddelware,
  adminMiddelware,
  getProfitForAdmin,
);
export default subScriptionRouter;
