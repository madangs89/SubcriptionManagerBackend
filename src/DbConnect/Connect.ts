import mongoose from "mongoose";
import { config } from "../config/env.js";

export const connectToDataBase = async (): Promise<void> => {
  try {
    await mongoose.connect(config.MONGODB_URI);
    console.log("Connected to MongoDB");
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error connecting to MongoDB:", error);
    }
  }
};
