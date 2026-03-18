import "dotenv/config";
import path from "path";
import express from "express";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";

// --- CONFIGURACIONES LOCALES ---
import { connectDB } from "./config/db.js";

// --- IMPORTACIÓN DE RUTAS ---
import userRouter from "./routes/user.route.js";
import productRouter from "./routes/product.route.js";
import orderRouter from "./routes/order.route.js";
import adminRouter from "./routes/admin.route.js";
import mobileRouter from "./routes/mobile.route.js"; 
import customerRouter from "./routes/customer.routes.js"; // 1️⃣ Importamos las nuevas rutas

const app = express();
const __dirname = path.resolve();

// ------------------------------
// 1️⃣ MIDDLEWARES INICIALES
// ------------------------------
app.use(cors({
  origin: ["http://localhost:5173", "http://10.171.241.150:8081"], 
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// ------------------------------
// 2️⃣ WEBHOOK + PARSEO
// ------------------------------
app.post("/api/webhooks/clerk", express.raw({ type: "application/json" }), (req, res) => {
  res.json({ received: true });
});

app.use(express.json());
app.use(clerkMiddleware());

// ------------------------------
// 3️⃣ RUTAS API
// ------------------------------
app.use("/api/mobile", mobileRouter);
app.use("/api/users", userRouter);
app.use("/api/products", productRouter);
app.use("/api/orders", orderRouter);
app.use("/api/admin", adminRouter);
app.use("/api/customers", customerRouter); // 2️⃣ Registramos la ruta de clientes

// Servir archivos estáticos
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ------------------------------
// 4️⃣ START SERVER
// ------------------------------
const startServer = async () => {
  try {
    await connectDB();
    const PORT = process.env.PORT || 3000;
    
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Servidor Local: http://localhost:${PORT}`);
      console.log(`📱 Servidor para Mobile: http://10.171.241.150:${PORT}`);
      console.log(`👥 API Clientes lista en: http://localhost:${PORT}/api/customers`);
    });
  } catch (error) {
    console.error("❌ Error al iniciar el servidor:", error);
    process.exit(1);
  }
};

startServer();