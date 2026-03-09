import dotenv from "dotenv";

dotenv.config();

const { PORT, MONGO_DB_URL, CLIENT_URL, ADMIN_EMAIL, ADMIN_PASSWORD, JWT_SECRET_KEY } =
  process.env;

if (!JWT_SECRET_KEY) {
  throw new Error("JWT_SECRET_KEY environment variable is not defined");
}

export const ENV = {
  PORT: process.env.PORT,
  MONGO_DB_URL: process.env.MONGO_DB_URL,
  CLIENT_URL: process.env.CLIENT_URL,
  ADMIN_EMAIL: process.env.ADMIN_EMAIL,
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
  JWT_SECRET_KEY: JWT_SECRET_KEY,
};