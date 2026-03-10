import express, { Request} from "express";
import { createFeedback } from "../controllers/feedback.controller";
import { validateFeedBackInputFields } from "../middleware/feedback.middleware";

const feedbackRouter = express.Router();
feedbackRouter.post("/", validateFeedBackInputFields, createFeedback);

export default feedbackRouter;