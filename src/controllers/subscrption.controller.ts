import type { Response } from "express";
import type { AuthMiddleWare } from "../interface/authMiddelware.interface.js";
import Subscription from "../models/Subscription.js";

export const getMySubScription = async (req: AuthMiddleWare, res: Response) => {
  try {
    if (!req.user?._id) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }
    let userId = req.user._id;

    const existingSub = await Subscription.findOne({
      userId,
      status: "success",
    }).sort({ createdAt: -1 });

    if (!existingSub) {
      return res.status(404).json({
        success: true,
        message: "Subscription Not found",
        subscription: null,
      });
    }

    if (existingSub?.endDate && existingSub.endDate < new Date()) {
      return res.status(400).json({
        success: true,
        message: "You don't have an active subscription",
        subscription: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: "You have an active subscription",
      subscription: existingSub,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
};





