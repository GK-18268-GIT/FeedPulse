import express, { Request, Response } from "express";
import { getAllFeedbacks, getFeedbackById, updateFeedbackStatus, deleteFeedback } from "../controllers/admin.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const adminRouter = express.Router();

adminRouter.get("/feedback", authMiddleware, getAllFeedbacks);
adminRouter.get("/feedback/:id", authMiddleware, getFeedbackById);
adminRouter.patch("/feedback/:id/status", authMiddleware, updateFeedbackStatus);
adminRouter.delete("/feedback/:id", authMiddleware, deleteFeedback);

export default adminRouter;