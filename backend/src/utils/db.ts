import mongoose, { connection } from "mongoose";
import { ENV } from "../config/env";

export const connectDB = async() => {
    try{
        const uri = ENV.MONGO_DB_URL;
        if(!uri) {
            throw new Error("MONGO_DB_URL is not set in the environment variables.");
        }

        const conn = await mongoose.connect(uri);
        console.log(`MongoDB Connected Successfully to host: ${conn.connection.host}, database: ${conn.connection.name}`);
    } catch(error) {
        console.error("Database connection failed", error);
        process.exit(1);
    }
};
