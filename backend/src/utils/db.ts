import mongoose, { connection } from "mongoose";
import { ENV } from "../config/env";

export const connectDB = async() => {
    try{
        const uri = ENV.MONGO_DB_URL;
        if(!uri) {
            throw new Error("MONGODB_URI is not set");
        }

        const conn = await mongoose.connect(uri);
        console.log("MongoDB Connected Successfully", conn.connection.host);
    } catch(error) {
        console.error("Database connection failed", error);
        process.exit(1);
    }
};

