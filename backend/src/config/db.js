import mongoose from "mongoose";
import { ENV } from "./env.js"; // Asegúrate de que el path sea correcto (env.js o env1.js)

export const connectDB = async () => {
  try {
    // CORRECCIÓN CLAVE: Usar ENV.DB_URL para acceder a la URL desde el objeto ENV
    const conn = await mongoose.connect(ENV.MONGO_URI);
    
    console.log(`✅ Connected to MONGODB: ${conn.connection.host}`);
  } catch (error) {
    // Mostrar el error real para una mejor depuración
    console.error(`💥 MONGODB connection error: ${error.message}`);
    process.exit(1); // Salir del proceso si la conexión a la BD falla
  }
};