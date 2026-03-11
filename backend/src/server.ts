import express from "express";
import cors from "cors";
import path from "path";

import { ENV } from "./config/env";
import authRouter from "./routes/auth.router";
import feedbackRouter from "./routes/feedback.router";
import { connectDB } from "./utils/db";
import adminRouter from "./routes/admin.router";

const __direname = path.resolve();

const PORT = ENV.PORT || 5000;

const app = express();

app.use(cors({
    origin: ENV.CLIENT_URL,
    credentials: true,
}))

app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/feedbacks", feedbackRouter);
app.use("/api/admin", adminRouter);

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});
