import { Request, Response } from "express";
import Feedback  from "../models/feedback.models";

/*Get All Feedbacks*/
export const getAllFeedbacks = async (req: Request, res: Response) => {
    try{
        const {status, category, sentiment, sortBy } = req.query;
        const filter: any = {};

        if(status) filter.status = status;
        if(category) filter.category = category;
        if(sentiment) filter.sentiment = sentiment;

        let query = Feedback.find(filter);
        
        if(sortBy === "priority") {
            query = query.sort({priority_score: -1});
        }

        if(sortBy === "latest") {
            query = query.sort({created_at: -1});
        }

        const feedback = await query;

        return res.status(200).json({
            message: "Feedback fetched successfully",
            success: true,
            count: feedback.length,
            data: feedback
        })
 
    } catch(error) {
         return res.status(500).json({
            message: "Internal server error",
            error: (error as Error).message
        });
    }

};

/*Get Single Feedback */
export const getFeedbackById = async (req: Request, res: Response) => {
    try{
        const feedbackById = await Feedback.findById(req.params.id)

        if(!feedbackById) {
            return res.status(404).json({
                message: "Feedback can not be found"
            });
        }

        return res.status(200).json({
            success: true,
            data: feedbackById
        });
    } catch(error) {
        return res.status(500).json({
            message: "Can not retrieve the feedback"
        });
    }
}

/*Update Feedback status */
export const updateFeedbackStatus = async (req:Request, res: Response) => {
    try{
        const { status } = req.body;
        
        const updateFeedback = await Feedback.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        if(!updateFeedback) {
            return res.status(404).json({
                message: "Feedback can not be found"
            });
        }

        return res.status(200).json({
            message: "Feedback status updated",
            data: updateFeedback
        });

    } catch(error) {
        return res.status(500).json({
            message: "Failed to update feedback"
        });
    }
}
/*Delete Feedback */
export const deleteFeedback = async (req: Request, res: Response) => {
    try{
        const feedback = await Feedback.findByIdAndDelete(req.params.id);

        if(!feedback) {
            return res.status(404).json({
                message: "Can not find the feedback"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Feedback deleted"
        });

    } catch(error) {
        return res.status(500).json({
            message: "Failed to delete feedback"
        });
    }
}