import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { ENV } from "../config/env";

const authRouter = express.Router();

const ADMIN_EMAIL = ENV.ADMIN_EMAIL;
const ADMIN_PASSWORD = ENV.ADMIN_PASSWORD;
const JWT_SECRET = ENV.JWT_SECRET;
const JWT_EXPIRES_IN = "1d";

authRouter.post("/login", (req: Request, res: Response) => {
  const { email, password } = req.body as {
    email?: string;
    password?: string;
  };

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      data: null,
      error: "VALIDATION_ERROR",
      message: "Email and password are required.",
    });
  }

  if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
    return res.status(401).json({
      success: false,
      data: null,
      error: "INVALID_CREDENTIALS",
      message: "Invalid email or password.",
    });
  }

  const token = jwt.sign(
    {
      sub: ADMIN_EMAIL,
      role: "admin",
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

  return res.status(200).json({
    success: true,
    data: { token },
    error: null,
    message: "Login successful.",
  });
});

export default authRouter;