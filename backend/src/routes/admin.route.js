import { Router } from "express";
import { 
  getAllProducts, 
  getAllOrders, 
  getDashboardStats, // 👈 Ajustado al nombre de tu controlador
  updateOrderStatus,
  getAllCustomers   // 👈 Agregamos la función que faltaba
} from "../controllers/admin.controller.js";
import { protectRoute, adminOnly } from "../middleware/auth.middleware.js";

const router = Router();

// Seguridad para todas las rutas de este archivo
router.use(protectRoute);
router.use(adminOnly);

// 1. PRODUCTOS
router.get("/products", getAllProducts);

// 2. ÓRDENES
router.get("/orders", getAllOrders);
router.patch("/orders/:orderId/status", updateOrderStatus);

// 3. ESTADÍSTICAS
// Nota: En tu controller se llama getDashboardStats, lo vinculamos aquí:
router.get("/stats", getDashboardStats);

// 4. CLIENTES (La pieza que faltaba para el 404)
router.get("/customers", getAllCustomers); 

export default router;