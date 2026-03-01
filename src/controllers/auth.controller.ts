import type { Request, Response } from "express";
import type { JwtPayload, LoginDTO, RegisterDTO } from "../types/auth.types.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "../config/env.js";
import type { AuthMiddleWare } from "../interface/authMiddelware.interface.js";

interface ApiRes {
  message: string;
  user?: object;
  success: boolean;
}

export const register = async (
  req: Request<{}, {}, RegisterDTO>,
  res: Response<ApiRes>,
): Promise<Response> => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res
        .status(400)
        .json({ message: "All fields are required", success: false });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists", success: false });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hashedPassword,
      name,
    });

    const payload: JwtPayload = {
      _id: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
    };

    const token = jwt.sign(payload, config.JWT_SECRET_KEY as string, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: config.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    return res.status(201).json({
      message: "User created successfully",
      user,
      success: true,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message, success: false });
    }
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
};

export const login = async (
  req: Request<{}, {}, LoginDTO>,
  res: Response<ApiRes>,
): Promise<Response> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required", success: false });
    }

    const isUserExitsOrNot = await User.findOne({ email });

    if (!isUserExitsOrNot) {
      return res
        .status(400)
        .json({ message: "Invalid email or password", success: false });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      isUserExitsOrNot.password!,
    );

    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ message: "Invalid email or password", success: false });
    }

    const payload: JwtPayload = {
      _id: isUserExitsOrNot._id.toString(),
      email: isUserExitsOrNot.email,
      name: isUserExitsOrNot.name,
      role: isUserExitsOrNot.role,
    };

    const token = jwt.sign(payload, config.JWT_SECRET_KEY as string, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: config.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    return res.status(200).json({
      message: "Login successful",
      user: payload,
      success: true,
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message, success: false });
    }
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
};

export const isAuth = async (
  req: AuthMiddleWare,
  res: Response<ApiRes>,
): Promise<Response> => {
  try {
    const user = req.user as JwtPayload;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized", success: false });
    }
    return res.status(200).json({
      message: "User is authenticated",
      user,
      success: true,
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message, success: false });
    }
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
};

export const logout = async (
  req: AuthMiddleWare,
  res: Response<ApiRes>,
): Promise<Response> => {
  try {
    res.clearCookie("token");
    return res.status(200).json({
      message: "Logout successful",
      success: true,
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message, success: false });
    }
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
};
