import path from "path";
import express from "express";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";

// --- CONFIGURACIONES LOCALES ---
import { ENV } from "./config/env.js"; 
import { connectDB } from "./config/db.js"; 

// --- IMPORTACIÓN DE RUTAS ---
import userRouter from "./routes/user.route.js";
import productRouter from "./routes/product.route.js";    // Nueva
import orderRouter from "./routes/order.route.js";      // Nueva
import categoryRouter from "./routes/category.route.js";  // Nueva
import statsRouter from "./routes/stats.route.js";      // Nueva

// --- IMPORTACIÓN DE CONTROLADORES ---
import { clerkWebhook } from "./controllers/webhook.controller.js";

const app = express();
const __dirname = path.resolve();

// --- 1. MIDDLEWARES INICIALES ---
app.use(cors());

// --- 2. ENDPOINT PARA WEBHOOK DE CLERK ---
// IMPORTANTE: Debe ir ANTES de express.json() para recibir el body "raw"
app.post(
  "/api/webhooks/clerk", 
  express.raw({ type: "application/json" }), 
  clerkWebhook
);

// --- 3. MIDDLEWARES DE PARSEO Y CLERK ---
app.use(express.json()); // A partir de aquí, el resto de rutas usan JSON
app.use(clerkMiddleware()); // Permite a Express leer el estado de sesión de Clerk

// --- 4. RUTAS DE LA API ---

// Ruta de salud (Útil para pruebas rápidas)
app.get("/api/health", (req, res) => {
  res.status(200).json({ 
    message: "Server is healthy", 
    env: ENV.NODE_ENV 
  });
});

// Registro de todas las rutas del eCommerce
app.use("/api/users", userRouter);           // Usuarios y perfiles
app.use("/api/products", productRouter);     // Catálogo de productos
app.use("/api/orders", orderRouter);         // Gestión de pedidos
app.use("/api/categories", categoryRouter);   // Categorías de productos
app.use("/api/stats", statsRouter);         // Estadísticas para el Admin

// --- 5. CONFIGURACIÓN DE PRODUCCIÓN ---
if (ENV.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../admin/dist")));

  app.get("/", (req, res) => {
    // Si la ruta no existe en la API, redirige al frontend
    if (req.originalUrl.startsWith("/api")) {
      return res.status(404).json({ message: "API route not found" });
    }
    res.sendFile(path.resolve(__dirname, "..", "admin", "dist", "index.html"));
  });
}

// --- 6. INICIO DEL SERVIDOR ---
const startServer = async () => {
  try {
    // Conexión a Base de Datos
    await connectDB();
    
    // Iniciar el servidor
    app.listen(ENV.PORT, () => {
      console.log(`🚀 Server running on port ${ENV.PORT}`);
      console.log(`🔗 Webhook URL: http://localhost:${ENV.PORT}/api/webhooks/clerk`);
      console.log(`📂 Rutas cargadas: Users, Products, Orders, Categories, Stats`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1); 
  }
};

startServer();