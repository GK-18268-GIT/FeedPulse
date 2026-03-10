import { Request, Response, NextFunction } from "express";

export const validateFeedBackInputFields  = (req: Request, res: Response, next: NextFunction) => {
    const { title, description, category, submitterEmail} = req.body;

    //Check required fields
    if(!title || !description || !category) {
        return res.status(400).json({
            message: "Title, description, and category are required"
        });
    }

    //Check email format if provided
    if(submitterEmail) {
        const emailRegex = /^\S+@\S+\.\S+$/;

        if(!emailRegex.test(submitterEmail)) {
            return res.status(400).json({
                message: "Invalid email formate"
            });
        }
    }

    //Validate title and description length
    if(title.length  > 100) {
        return res.status(400).json({
            message: "Title length should not exceed 100 characters"
        });
    }

    if(description.length  < 20) {
        return res.status(400).json({
            message: "Description length must be at least 20 characters"
        });
    }

    //validate category
    if(!["Bug", "Feature Request", "Improvement", "Other"].includes(category)) {
        return res.status(400).json({
            message: "Invalid category type"
        });
    }

    next();

}