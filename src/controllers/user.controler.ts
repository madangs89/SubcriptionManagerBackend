import type { Response, Request } from "express";
import User from "../models/user.model.js";
import Subscription from "../models/Subscription.js";

export const getAllUsersForAdmin = async (req: Request, res: Response) => {
  try {
    const allUsers = await User.find()
      .select("-password")
      .sort({ createdAt: -1 });
    res.status(200).json({
      message: "Users fetched successfully",
      success: true,
      users: allUsers,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
};

export const deleteUserByAdmin = async (
  req: Request<{}, {}, { userId: string }>,
  res: Response,
) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res
        .status(400)
        .json({ message: "User ID is required", success: false });
    }
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }
    return res
      .status(200)
      .json({ message: "User deleted successfully", success: true });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting user", success: false, error });
  }
};

export const getAllSubscribedUsersForAdmin = async (
  req: Request,
  res: Response,
) => {
  try {
    const allActiveSubscribedUsers = await Subscription.find({
      status: "success",
      endDate: { $gt: new Date() },
    })
      .populate("userId", "-password")
      .sort({ createdAt: -1 });
    return res.status(200).json({
      message: "Subscribed users fetched successfully",
      success: true,
      users: allActiveSubscribedUsers,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching subscribed users", error });
  }
};

export const getAllUnSubscribedUsersForAdmin = async (
  req: Request,
  res: Response,
) => {
  try {
    const unsubscribedUsers = await Subscription.find({
      status: "cancelled",
    }).populate("userId", "-password");

    return res.status(200).json({
      message: "Unsubscribed users fetched successfully",
      success: true,
      users: unsubscribedUsers,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching unsubscribed users", error });
  }
};


