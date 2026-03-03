import express from "express";
import {
  deleteUserByAdmin,
  getAllSubscribedUsersForAdmin,
  getAllUnSubscribedUsersForAdmin,
  getAllUsersForAdmin,
} from "../controllers/user.controler.js";
import {
  adminMiddelware,
  authMiddelware,
} from "../middlewares/authMiddelware.js";

const userRouter = express.Router();

userRouter.get(
  "/admin/all-users",
  authMiddelware,
  adminMiddelware,
  getAllUsersForAdmin,
);
userRouter.get(
  "/admin/all-subscribed-users",
  authMiddelware,
  adminMiddelware,
  getAllSubscribedUsersForAdmin,
);
userRouter.get(
  "/admin/all-unsubscribed-users",
  authMiddelware,
  adminMiddelware,
  getAllUnSubscribedUsersForAdmin,
);
userRouter.delete(
  "/admin/user/delete",
  authMiddelware,
  adminMiddelware,
  deleteUserByAdmin,
);

export default userRouter;
