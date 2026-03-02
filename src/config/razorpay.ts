import { config } from "./env.js";

import Razorpay from "razorpay";
const razorpay = new Razorpay({
  key_id: config.RAZORPAY_API_KEY,
  key_secret: config.RAZORPAY_API_SECRET,
});

export default razorpay;
