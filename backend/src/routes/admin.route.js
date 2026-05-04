import { Router } from "express";
import { 
  getAllProducts,
  createProduct,    // ✅ AGREGAR
  updateProduct,    // ✅ AGREGAR
  deleteProduct,    // ✅ AGREGAR
  getAllOrders, 
  getDashboardStats,
  updateOrderStatus,
  getAllCustomers
} from "../controllers/admin.controller.js";
import { protectRoute, adminOnly } from "../middleware/auth.middleware.js";

const router = Router();

// Seguridad para todas las rutas de este archivo
router.use(protectRoute);
router.use(adminOnly);

// 1. PRODUCTOS
router.get("/products", getAllProducts);
router.post("/products", createProduct);      // ✅ AGREGAR
router.put("/products/:id", updateProduct);   // ✅ AGREGAR
router.delete("/products/:id", deleteProduct); // ✅ AGREGAR

// 2. ÓRDENES
router.get("/orders", getAllOrders);
router.patch("/orders/:orderId/status", updateOrderStatus);

// 3. ESTADÍSTICAS
router.get("/stats", getDashboardStats);

// 4. CLIENTES
router.get("/customers", getAllCustomers);

export default router;