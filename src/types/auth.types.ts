type RegisterDTO = {
  email: string;
  password: string;
  name: string;
};

type LoginDTO = {
  email: string;
  password: string;
};

type JwtPayload = {
  _id: string;
  email: string;
  name: string;
  role: string;
};

type GoogleAuthDTO = {
  token: string;
};

type PaymentRequestBody = {
  billingCycle: string;
  currency: string;
};

type VerifyPaymentRequestBody = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

export type {
  RegisterDTO,
  LoginDTO,
  JwtPayload,
  GoogleAuthDTO,
  PaymentRequestBody,
  VerifyPaymentRequestBody,
};
