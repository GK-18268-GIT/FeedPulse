import { Request, Response } from "express";
import Feedback from "../models/feedback.models";
import { analyzeFeedbackWithGemini } from "../services/gemini.service";

export const createFeedback = async (req: Request, res: Response) => {
  try {

    const { title, description, category, submitterName, submitterEmail } =
      req.body;

    if (!title || !description || !category) {
      return res.status(400).json({
        message: "Title, description and category are required"
      });
    }

    // Save initial feedback
    const newFeedback = new Feedback({
      title,
      description,
      category,
      submitterName,
      submitterEmail
    });

    const savedFeedback = await newFeedback.save();

    // Run AI analysis
    const aiAnalysis = await analyzeFeedbackWithGemini(title, description);

    if (aiAnalysis) {

      savedFeedback.ai_category = aiAnalysis.ai_category;
      savedFeedback.sentiment = aiAnalysis.ai_sentiment;
      savedFeedback.priority_score = aiAnalysis.ai_priority;
      savedFeedback.summary = aiAnalysis.ai_summary;
      savedFeedback.tags = aiAnalysis.ai_tags;

      savedFeedback.processed = true;

      await savedFeedback.save();

      return res.status(201).json({
        message: "Feedback created and AI analysis completed",
        data: savedFeedback
      });
    }

    return res.status(201).json({
      message: "Feedback created but AI analysis failed",
      data: savedFeedback
    });

  } catch (error) {
    console.error("Error creating feedback:", error);

    return res.status(500).json({
      message: "Internal server error",
      error: (error as Error).message
    });
  }
};