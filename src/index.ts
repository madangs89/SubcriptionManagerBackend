import express, { type Request, type Response } from "express";
import { config } from "./config/env.js";
import cookieParser from "cookie-parser";

import cors from "cors";
import { connectToDataBase } from "./DbConnect/Connect.js";
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import subScriptionRouter from "./routes/subcription.routes.js";
import orderRouter from "./routes/order.routes.js";
import { rateLimit } from "express-rate-limit";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(
  cors({
    origin: "*",
  }),
);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  ipv6Subnet: 56, // Set to 60 or 64 to be less aggressive, or 52 or 48 to be more aggressive
});

app.use("/api/v1/auth", limiter, authRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/subcription", subScriptionRouter);
app.use("/api/v1/payment", limiter, orderRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World");
});

app.listen(config.PORT, async () => {
  await connectToDataBase();
  console.log(`Server is running on port ${config.PORT}`);
});
