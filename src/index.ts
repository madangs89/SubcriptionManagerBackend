import express, { type Request, type Response } from "express";
import { config } from "./config/env.js";
import cookieParser from "cookie-parser";

import cors from "cors";
import { connectToDataBase } from "./DbConnect/Connect.js";
import authRouter from "./routes/auth.routes.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(
  cors({
    origin: "*",
  }),
);


app.use("/api/v1/auth" , authRouter)

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World");
});

app.listen(config.PORT, async () => {
  await connectToDataBase();
  console.log(`Server is running on port ${config.PORT}`);
});
