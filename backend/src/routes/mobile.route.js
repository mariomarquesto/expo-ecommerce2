import { Router } from "express";
import { getMobileProducts } from "../controllers/mobile.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = Router();

// RUTA PÚBLICA: Para que la app cargue productos apenas abre
router.get("/products", getMobileProducts);

// RUTA PRIVADA: Ejemplo para ver el perfil (necesita estar logueado en Clerk)
// router.get("/profile", protectRoute, getProfile);

export default router;