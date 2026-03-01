import type { NextFunction, Response } from "express";
import type { AuthMiddleWare } from "../interface/authMiddelware.interface.js";

import jwt from "jsonwebtoken";
import { config } from "../config/env.js";
import type { JwtPayload } from "../types/auth.types.js";
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
