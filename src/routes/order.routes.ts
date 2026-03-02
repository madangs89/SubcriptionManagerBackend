import express from "express";

import { authMiddelware } from "../middlewares/authMiddelware.js";
import { createPayment } from "../controllers/order.controller.js";

const orderRouter = express.Router();

orderRouter.post("/create", authMiddelware, createPayment);

export default orderRouter;
