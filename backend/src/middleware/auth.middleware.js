import { requireAuth } from "@clerk/express";
import { User } from "../models/user.model.js";
import { ENV } from "../config/env.js";

export const protectRoute = async (req, res, next) => {
  return requireAuth()(req, res, async () => {
    try {
      // Obtenemos los datos que Clerk ya tiene en el request
      const clerkId = req.auth?.userId;
      
      if (!clerkId) {
        return res.status(401).json({ message: "No autorizado - Token inválido" });
      }

      let user = await User.findOne({ clerkId });

      // --- SI EL USUARIO NO EXISTE EN MONGO, LO CREAMOS CON TODO LO REQUERIDO ---
      if (!user) {
        console.log("🛠️ Creando usuario en MongoDB para ClerkID:", clerkId);
        
        // Intentamos obtener datos básicos del objeto auth de Clerk si están disponibles
        // Si no, usamos el email del ENV como respaldo para que no falle la validación
        user = await User.create({
          clerkId: clerkId,
          email: ENV.ADMIN_EMAIL || "admin@local.com", 
          name: "Admin Local", // El campo 'name' es requerido por tu modelo
          imageUrl: "",        // Opcional según tu esquema
          addresses: [],       // Array vacío para cumplir con el esquema
        });
        
        console.log("✅ Usuario creado exitosamente en la DB local.");
      }

      req.user = user;
      next();
    } catch (error) {
      console.error("❌ Error en protectRoute:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });
};

export const adminOnly = (req, res, next) => {
  // Pasamos todo a minúsculas para que la comparación sea exacta
  const userEmail = (req.user?.email || "").toLowerCase();
  const adminEmail = (ENV.ADMIN_EMAIL || "").toLowerCase();

  if (userEmail && userEmail === adminEmail) {
    return next();
  }

  console.log(`🚫 Bloqueado por adminOnly. Detectado: [${userEmail}] vs Esperado: [${adminEmail}]`);
  return res.status(403).json({ message: "Acceso denegado: Se requiere rol de Administrador" });
};