import dotenv from "dotenv";

dotenv.config();

const { PORT, MONGO_DB_URL, CLIENT_URL, ADMIN_EMAIL, ADMIN_PASSWORD, JWT_SECRET_KEY, GEMINI_API_KEY } =
  process.env;

if (!JWT_SECRET_KEY) {
  throw new Error("JWT_SECRET_KEY environment variable is not defined");
}

if (!GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY environment variable is not defined");
}

export const ENV = {
  PORT: PORT,
  MONGO_DB_URL: MONGO_DB_URL,
  CLIENT_URL: CLIENT_URL,
  ADMIN_EMAIL: ADMIN_EMAIL,
  ADMIN_PASSWORD: ADMIN_PASSWORD,
  JWT_SECRET_KEY: JWT_SECRET_KEY,
  GEMINI_API_KEY: GEMINI_API_KEY
};