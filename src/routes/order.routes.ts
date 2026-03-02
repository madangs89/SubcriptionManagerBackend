import express from "express";

import { authMiddelware } from "../middlewares/authMiddelware.js";
import {
  createPayment,
  verifyPayment,
} from "../controllers/order.controller.js";

const orderRouter = express.Router();

orderRouter.post("/create", authMiddelware, createPayment);
orderRouter.post("/verify", authMiddelware, verifyPayment);

export default orderRouter;
