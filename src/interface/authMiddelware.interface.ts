import { type Request } from "express";

interface AuthMiddleWare<
  P = {},
  ResBody = any,
  ReqBody = any,
  ReqQuery = any,
> extends Request<P, ResBody, ReqBody, ReqQuery> {
  user?: {
    _id: string;

    email: string;
    name: string;
    role: string;
  };
}

export type { AuthMiddleWare };
