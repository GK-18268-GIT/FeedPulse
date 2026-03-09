import { Request, Response} from "express";
import { ENV } from "../config/env";
import jwt from "jsonwebtoken";

const ADMIN_EMAIL = ENV.ADMIN_EMAIL;
const ADMIN_PASSWORD = ENV.ADMIN_PASSWORD;
const JWT_SECRET_KEY = ENV.JWT_SECRET_KEY;
const JWT_EXPIRES_IN = "1h";

export async function login(req: Request, res: Response) {
    const { email, password } = req.body as {
        email: string;
        password: string;
    };

    if(!email || !password) {
        return res.status(400).json({
            success: false,
            data: null,
            error: "Validation error",
            message: "Email and password are required"
        });
    }

    if(email != ADMIN_EMAIL || password != ADMIN_PASSWORD) {
        return res.status(400).json({
            success: false,
            data: null,
            error: "Invalid credentials",
            message: "Invalid email or password"
        });
    }

    const token = jwt.sign({
        sub: ADMIN_EMAIL,
        role: "admin"
    }, JWT_SECRET_KEY as string, {
        expiresIn: JWT_EXPIRES_IN
    });

    return res.status(200).json({
        status: true,
        data: token,
        error: null,
        message: "Login Successful"
    });

}
