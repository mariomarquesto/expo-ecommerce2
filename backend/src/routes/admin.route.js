import { Router } from "express";
import { getAllProducts } from "../controllers/admin.controller.js";
import { protectRoute, adminOnly } from "../middleware/auth.middleware.js";

const router = Router();

// PRUEBA ASÍ: Define la ruta completa con sus middlewares directamente
router.get("/products", protectRoute, adminOnly, getAllProducts);

export default router;