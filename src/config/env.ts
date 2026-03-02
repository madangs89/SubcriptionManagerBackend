import dotenv from "dotenv";

dotenv.config();

if (!process.env.PORT) {
  throw new Error("PORT is not defined in environment variables");
}

if (!process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined in environment variables");
}

if (!process.env.JWT_SECRET_KEY) {
  throw new Error("JWT_SECRET_KEY is not defined in environment variables");
}

if (!process.env.RAZORPAY_API_KEY || !process.env.RAZORPAY_API_SECRET) {
  throw new Error(
    "RAZORPAY_API_KEY or RAZORPAY_API_SECRET is not defined in environment variables",
  );
}

export const config = {
  PORT: parseInt(process.env.PORT as string) || 5000,
  MONGODB_URI: process.env.MONGODB_URI,
  NODE_ENV: process.env.NODE_ENV || "development",
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
  RAZORPAY_API_KEY: process.env.RAZORPAY_API_KEY,
  RAZORPAY_API_SECRET: process.env.RAZORPAY_API_SECRET,
};
