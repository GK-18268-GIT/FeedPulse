import { GoogleGenerativeAI } from "@google/generative-ai";
import { ENV } from "../config/env";

const genAI = new GoogleGenerativeAI(ENV.GEMINI_API_KEY as string);

export const analyzeFeedbackWithGemini = async (
  title: string,
  description: string
) => {
  try {
    // Updated to use the current stable model: Gemini 2.5 Flash
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      Analyze the following user feedback and return a JSON object.
      You must return ONLY the JSON. No markdown, no backticks, no preamble.

      Format:
      {
        "ai_category": "Bug" | "Feature Request" | "Improvement" | "Other",
        "ai_sentiment": "Positive" | "Neutral" | "Negative",
        "ai_priority": number (1-10),
        "ai_summary": "string",
        "ai_tags": ["string"]
      }

      Feedback Title: ${title}
      Feedback Description: ${description}
    `;

    // We remove generationConfig to avoid the "Unknown field" 400 error
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // ROBUST CLEANING: In case the AI still wraps the response in ```json ... ```
    const cleanedText = responseText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(cleanedText);

  } catch (error: any) {
    console.error("Gemini AI Final Error:", error.message);
    return null;
  }
};