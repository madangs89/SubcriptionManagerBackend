import { type Request } from "express";

interface AuthMiddleWare extends Request {
  user?: {
    _id: string;
    email: string;
    name: string;
    role: string;
  };
}

export type { AuthMiddleWare };
