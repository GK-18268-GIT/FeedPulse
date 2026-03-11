import mongoose, { Document, Schema } from "mongoose";

export interface IFeedback extends Document {
    title: string;
    description: string;
    category: "Bug" | "Feature Request" | "Improvement" | "Other";
    status:  "New" | "In Review"| "Resolved";

    submitterName?: string;
    submitterEmail?: string;

    //AI generated fields
    ai_category?: "Bug" | "Feature Request" | "Improvement" | "Other";
    sentiment?: "Positive" | "Neutral" | "Negative";
    priority_score?: number;
    summary?: string;
    tags?: string[];

    processed: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const FeedbackSchema: Schema = new Schema(
    {
        id: {
            type: Number,
            unique: true,

        },

        title: {
            type: String,
            required: true,
            maxlength: 100,
            trim: true,
        },

        description: {
            type: String,
            required: true,
            maxlength: 1000,
            trim: true,
        },

        category: {
            type: String,
            enum: ["Bug", "Feature Request", "Improvement", "Other"],
            required: true,
        },

        status: {
            type: String,
            enum: ["New", "In Review", "Resolved"],
            default: "New",
        },

        submitterName: {
            type: String,
            trim: true,
        },

        submitterEmail: {
            type: String,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"]
        },

        //AI analysis fields
        ai_category: {
            type: String,
            enum: ["Bug", "Feature Request", "Improvement", "Other"]
        },

        sentiment: {
            type: String,
            enum: ["Positive", "Neutral", "Negative"]
        },

        priority_score: {
            type: Number,
            min: 1,
            max: 10
        },

        summary: {
            type: String
        },

        tags: {
            type: [String]
        },

        processed: {
            type: Boolean,
            default: false
        }
    },

    {
        timestamps: true
    }
);

FeedbackSchema.index({ status: 1 });
FeedbackSchema.index({ category: 1 });
FeedbackSchema.index({ priority_score: -1 });
FeedbackSchema.index({ createdAt: -1 });

export default mongoose.model<IFeedback>("Feedback", FeedbackSchema);