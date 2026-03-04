import dotenv from "dotenv";
import path from "path";

// FORZAMOS la ruta exacta del .env
const envPath = path.resolve(process.cwd(), ".env");

dotenv.config({
  path: envPath,
});

console.log("📂 dotenv path =>", envPath);
console.log("🔑 MONGO_URI =>", process.env.MONGO_URI);

export const ENV = {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  MONGO_URI: process.env.MONGO_URI,
};