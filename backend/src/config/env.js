import dotenv from "dotenv";
import path from "path";

// FORZAMOS la ruta exacta del .env
const envPath = path.resolve(process.cwd(), ".env");

dotenv.config({
  path: envPath,
});

export const ENV = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: process.env.PORT || 3000,
  MONGO_URI: process.env.MONGO_URI,
  // --- AGREGAR ESTO ---
  ADMIN_EMAIL: process.env.ADMIN_EMAIL,
  CLERK_PUBLISHABLE_KEY: process.env.CLERK_PUBLISHABLE_KEY,
  CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
};

// Log para confirmar que ahora sí lee el email
console.log("✅ ADMIN_EMAIL cargado:", ENV.ADMIN_EMAIL);