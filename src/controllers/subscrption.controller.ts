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

export const getAllSubScriptionHistory = async (
  req: AuthMiddleWare,
  res: Response,
) => {
  try {
    if (!req.user?._id) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }
    let userId = req.user._id;

    const allSubscriptions = await Subscription.find({ userId }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      message: "All subscriptions retrieved successfully",
      subscriptions: allSubscriptions,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
};

export const cancelSubscription = async (
  req: AuthMiddleWare,
  res: Response,
) => {
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
        message: "Active subscription Not found",
      });
    }
    existingSub.status = "cancelled";
    await existingSub.save();

    return res.status(200).json({
      success: true,
      message: "Subscription cancelled successfully",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
};

export const getAllSubScriptionForAdmin = async (
  req: AuthMiddleWare,
  res: Response,
) => {
  try {
    const allSubscriptions = await Subscription.find().sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      message: "All subscriptions retrieved successfully",
      subscriptions: allSubscriptions,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
};

export const getProfitForAdmin = async (req: AuthMiddleWare, res: Response) => {
  try {
    const allSubscriptions = await Subscription.find({
      status: "success",
    });
    let totalAmount = 0;

    if (allSubscriptions.length === 0) {
      return res.status(200).json({
        success: true,
        message: "All subscriptions retrieved successfully",
        totalAmount: 0,
      });
    }
    for (let i = 0; i < allSubscriptions.length; i++) {
      totalAmount += allSubscriptions[i]?.price || 0;
    }
    return res.status(200).json({
      success: true,
      message: "All subscriptions retrieved successfully",
      totalAmount,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
};



