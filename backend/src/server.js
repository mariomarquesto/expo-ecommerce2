import path from "path";
import express from "express";
import { ENV } from "./config/env.js"; // Importa tu configuración de entorno
import { connectDB } from "./config/db.js"; // Importa la función de conexión a la BD
import cors from "cors";
// No es necesario importar ni llamar a dotenv aquí si ya lo haces en ./config/env.js
// import dotenv from "dotenv"; 

const app = express();

// Necesario en ES Modules
const __dirname = path.resolve();

// Middlewares
app.use(express.json());
app.use(cors()); // Añadido un middleware común

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "success" });
});

// Producción: servir Admin (Vite)
if (ENV.NODE_ENV === "production") {
  console.log("Serving static files for production environment.");
  
  app.use(
    express.static(path.join(__dirname, "../admin/dist"))
  );

  // Catch-all para SPA: sirve el index.html
  app.get("/", (req, res) => { // Cambiado a '*' para manejar todas las rutas no definidas
    res.sendFile(
      path.resolve(__dirname, "..", "admin", "dist", "index.html")
    );
  });
}

// Función principal para iniciar la aplicación (Conexión a BD primero)
const startServer = async () => {
  try {
    // 1. CONECTAR A LA BASE DE DATOS
    await connectDB();
    
    // 2. INICIAR EL SERVIDOR SOLO DESPUÉS DE LA CONEXIÓN EXITOSA
    app.listen(ENV.PORT, () => {
      console.log(`🚀 Server running on port ${ENV.PORT} in ${ENV.NODE_ENV} mode.`);
      console.log(`🌐 Accessible via: http://localhost:${ENV.PORT}`);
    });
  } catch (error) {
    // Si connectDB lanza un error, se maneja aquí (aunque connectDB ya hace un process.exit(1))
    console.error("❌ Failed to start server after database attempt.");
    // No es necesario process.exit(1) aquí de nuevo, pero ayuda a ser explícito
    process.exit(1); 
  }
};

startServer();