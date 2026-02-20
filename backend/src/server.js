// --- CARGA DE VARIABLES DE ENTORNO ---
import dotenv from "dotenv";
dotenv.config();

// --- IMPORTS PRINCIPALES ---
import path from "path";
import express from "express";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";

// --- CONFIGURACIONES LOCALES ---
import { ENV } from "./config/env.js";
import { connectDB } from "./config/db.js";

// --- IMPORTACIÓN DE RUTAS ---
import userRouter from "./routes/user.route.js";
import productRouter from "./routes/product.route.js";
import orderRouter from "./routes/order.route.js";
import categoryRouter from "./routes/category.route.js";
import statsRouter from "./routes/stats.route.js";

// --- IMPORTACIÓN DE CONTROLADORES ---
import { clerkWebhook } from "./controllers/webhook.controller.js";

const app = express();
const __dirname = path.resolve();

// ------------------------------
// 1️⃣ MIDDLEWARES INICIALES
// ------------------------------
app.use(cors());

// ------------------------------
// 2️⃣ WEBHOOK CLERK (BODY RAW)
// ------------------------------
app.post(
  "/api/webhooks/clerk",
  express.raw({ type: "application/json" }),
  clerkWebhook
);

// ------------------------------
// 3️⃣ PARSEO JSON + CLERK
// ------------------------------
app.use(express.json());
app.use(clerkMiddleware());

// ------------------------------
// 4️⃣ RUTAS API
// ------------------------------
app.get("/api/health", (req, res) => {
  res.status(200).json({
    message: "Server is healthy",
    env: ENV.NODE_ENV,
  });
});

app.use("/api/users", userRouter);
app.use("/api/products", productRouter);
app.use("/api/orders", orderRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/stats", statsRouter);

// ------------------------------
// 5️⃣ PRODUCCIÓN
// ------------------------------
if (ENV.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../admin/dist")));

  app.get("*", (req, res) => {
    if (req.originalUrl.startsWith("/api")) {
      return res.status(404).json({ message: "API route not found" });
    }

    res.sendFile(
      path.resolve(__dirname, "..", "admin", "dist", "index.html")
    );
  });
}

// ------------------------------
// 6️⃣ START SERVER
// ------------------------------
const startServer = async () => {
  try {
    await connectDB();

    app.listen(ENV.PORT || 3000, () => {
      console.log(`🚀 Server running on port ${ENV.PORT || 3000}`);
      console.log(
        `🔗 Webhook URL: http://localhost:${ENV.PORT || 3000}/api/webhooks/clerk`
      );
      console.log(
        `📂 Rutas cargadas: Users, Products, Orders, Categories, Stats`
      );
    });
  } catch (error) {
    console.error("❌ Error al iniciar el servidor:", error);
    process.exit(1);
  }
};

startServer();
