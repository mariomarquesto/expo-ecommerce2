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
import adminRouter from "./routes/admin.route.js"; // <-- AGREGADO

const app = express();
const __dirname = path.resolve();

// ------------------------------
// 1️⃣ MIDDLEWARES INICIALES (CORREGIDO)
// ------------------------------
app.use(cors({
  origin: "http://localhost:5173", // La URL de tu Vite
  credentials: true,               // Vital para que Clerk funcione
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// ------------------------------
// 2️⃣ WEBHOOK + PARSEO
// ------------------------------
// Webhook va antes de express.json()
app.post("/api/webhooks/clerk", express.raw({ type: "application/json" }), (req, res) => {
  /* tu lógica de webhook */
});

app.use(express.json());
app.use(clerkMiddleware());

// ------------------------------
// 3️⃣ RUTAS API (CORREGIDO)
// ------------------------------
app.use("/api/users", userRouter);
app.use("/products", productRouter);
app.use("/api/orders", orderRouter);
app.use("/api/admin", adminRouter); // <-- AGREGADO: Esto resuelve el 404

// ------------------------------
// 4️⃣ START SERVER
// ------------------------------
const startServer = async () => {
  try {
    await connectDB();
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

startServer();