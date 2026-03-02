import crypto from "crypto";
import { Order } from "../models/Order.js";
import razorpay from "../config/razorpay.js";
import type { Response, Request } from "express";
import type {
  PaymentRequestBody,
  VerifyPaymentRequestBody,
} from "../types/auth.types.js";
import type { AuthMiddleWare } from "../interface/authMiddelware.interface.js";
import { config } from "../config/env.js";
import Subscription from "../models/Subscription.js";

type ApiRes = {
  success: boolean;
  message: string;
  data?: any;
};

export const createPayment = async (
  req: AuthMiddleWare<{}, {}, PaymentRequestBody>,
  res: Response<ApiRes>,
) => {
  try {
    let { billingCycle, currency } = req.body;

    if (!req.user?._id) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }
    const userId = req.user._id;

    const existingSub = await Subscription.findOne({
      userId,
      status: "success",
    }).sort({ createdAt: -1 });

    if (existingSub?.endDate && existingSub.endDate > new Date()) {
      return res.status(400).json({
        success: false,
        message: "You already have an active subscription",
      });
    }

    if (!currency) {
      currency = "INR";
    }

    if (!billingCycle || !["MONTHLY", "YEARLY"].includes(billingCycle)) {
      return res.status(400).json({
        success: false,
        message: "Invalid billing cycle. Must be 'MONTHLY' or 'YEARLY'",
      });
    }

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    let money = billingCycle == "MONTHLY" ? 199 : 1999;
    const amount = money * 100;

    const order = await razorpay.orders.create({
      amount,
      currency,
      receipt: `rcpt_${Date.now()}`,
    });

    await Order.create({
      userId,
      razorpayOrderId: order.id,
      amount,
      currency,
      billingCycle,
      status: "created",
    });
    res.json({
      success: true,
      message: "Payment created successfully",
      data: {
        orderId: order.id,
        amount,
        currency,
        billingCycle,
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Failed to create payment" });
  }
};

export const verifyPayment = async (
  req: AuthMiddleWare<{}, {}, VerifyPaymentRequestBody>,
  res: Response<ApiRes>,
) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid payment details" });
    }

    if (!req.user?._id) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", config.RAZORPAY_API_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid signature" });
    }

    const order = await Order.findOne({
      razorpayOrderId: razorpay_order_id,
    });

    if (!order || order.status === "paid") {
      return res
        .status(400)
        .json({ success: false, message: "Order not found or already paid" });
    }

    if (order.userId.toString() !== req.user._id) {
      return res.status(403).json({
        success: false,
        message: "Order does not belong to user",
      });
    }

    // Mark order paid
    order.status = "paid";
    await order.save();

    const existingPayment = await Subscription.findOne({
      razorpayPaymentId: razorpay_payment_id,
    });

    if (existingPayment) {
      return res.json({
        success: true,
        message: "Payment already processed",
      });
    }

    let subScription = await Subscription.create({
      userId: order.userId,
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      signature: razorpay_signature,
      amount: order.amount,
      status: "success",
      startDate: new Date(),
      endDate:
        order.billingCycle === "MONTHLY"
          ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      billingCycle: order.billingCycle,
      price: order.amount / 100,
    });

    res.json({
      success: true,
      message: "Payment verified successfully",
      data: subScription,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to verify payment" });
  }
};
