import path from "path";
import express from "express";
import { ENV } from "./config/env.js";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";



const app = express();

// Necesario en ES Modules
const __dirname = path.resolve();

// Middlewares
app.use(express.json());

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "success" });
});

// Producción: servir Admin (Vite)
if (ENV.NODE_ENV === "production") {
  app.use(
    express.static(path.join(__dirname, "../admin/dist"))
  );

  // Catch-all para SPA
  app.get("/", (req, res) => {
    res.sendFile(
      path.join(__dirname, "admin", "dist", "index.html")
    );
  });
}

// Server
app.listen(ENV.PORT, () => {
  console.log(`🚀 Server running on port ${ENV.PORT}`);
});


const startServer = async () => {
  await connectDB();
  app.listen(ENV.PORT, () => {
    console.log("Server is up and running");
  });
};

startServer();
