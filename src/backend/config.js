import { config } from "dotenv";
config();

export const PORT = process.env.PORT || 8080;
export const DB_USER = process.env.DB_USER || "admin-ayd";
export const DB_PASSWORD = process.env.DB_PASSWORD || "12345";
export const DB_SERVER = process.env.DB_SERVER || "104.154.204.21";
export const DB_DATABASE = process.env.DB_DATABASE || "analisis";