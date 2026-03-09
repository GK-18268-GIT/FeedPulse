import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ENV } from "../config/env";

const JWT_SECRET_KEY = ENV.JWT_SECRET_KEY;

export interface authRequest extends Request {
    user?: {
        sub: string;
        role: string;
    };
}

export function authMiddleware(
    req: authRequest,
    res: Response,
    next: NextFunction
) {
    const authHeader = req.headers['authorization'];

    if(!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            message: 'Authorization header missing'
        });
    }

    const token = authHeader.split(' ')[1];
    if(!token) {
        return res.status(401).json({
            message: 'Token missing' 
        });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET_KEY as string);
        req.user = decoded as { sub: string; role: string };
        next();
    } catch(error) {
        return res.status(401).json({
            success: false,
            data: null,
            error: 'Invalid token',
            message: 'Invalid or expired token'
        });
    }

}
