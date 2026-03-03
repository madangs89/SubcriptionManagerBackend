import type { NextFunction, Response } from "express";
import type { AuthMiddleWare } from "../interface/authMiddelware.interface.js";

import jwt from "jsonwebtoken";
import { config } from "../config/env.js";
import type { JwtPayload } from "../types/auth.types.js";
import Subscription from "../models/Subscription.js";
export const authMiddelware = (
  req: AuthMiddleWare,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized", success: false });
    }

    const decode = jwt.verify(
      token,
      config.JWT_SECRET_KEY as string,
    ) as JwtPayload;
    req.user = decode;
    next();
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message, success: false });
    }
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
};
export const adminMiddelware = (
  req: AuthMiddleWare,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized", success: false });
    }

    const decode = jwt.verify(
      token,
      config.JWT_SECRET_KEY as string,
    ) as JwtPayload;

    if (decode.role !== "admin") {
      return res.status(403).json({ message: "Forbidden", success: false });
    }
    req.user = decode;
    next();
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message, success: false });
    }
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
};
export const subscriptionMiddelware = async (
  req: AuthMiddleWare,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized", success: false });
    }

    const decode = jwt.verify(
      token,
      config.JWT_SECRET_KEY as string,
    ) as JwtPayload;

    const { _id } = decode;

    if (!_id) {
      return res
        .status(400)
        .json({ message: "User not found", success: false });
    }

    const existingSub = await Subscription.findOne({
      userId: _id,
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

    req.user = decode;
    next();
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message, success: false });
    }
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
};
