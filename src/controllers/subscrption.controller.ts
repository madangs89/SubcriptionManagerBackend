import type { Response } from "express";
import type { AuthMiddleWare } from "../interface/authMiddelware.interface.js";

export const getMySubScription = (req: AuthMiddleWare, res: Response) => {
  try {
    if (!req.user?._id) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
};
