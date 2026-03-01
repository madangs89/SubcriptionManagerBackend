import express from "express";
import {
  isAuth,
  login,
  logout,
  register,
} from "../controllers/auth.controller.js";
import { authMiddelware } from "../middlewares/authMiddelware.js";

const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.get("/isAuth", authMiddelware, isAuth);

export default authRouter;
