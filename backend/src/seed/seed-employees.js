// backend/seed-employees.js
import mongoose from "mongoose";
import { Employee } from "./src/models/employee.model.js";
import dotenv from "dotenv";

dotenv.config();

const seedEmployees = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Conectado a MongoDB");
    
    // Eliminar empleados existentes
    await Employee.deleteMany({});
    console.log("🗑️ Empleados eliminados");
    
    // Crear empleado ADMIN
    const admin = await Employee.create({
      name: "Administrador",
      email: "admin@empresa.com",
      password: "admin123",
      role: "admin",
      department: "IT",
      position: "Administrador del Sistema",
      phone: "123456789",
    });
    console.log(`✅ Admin creado: ${admin.email} - ${admin.password}`);
    
    // Crear empleado normal
    const employee = await Employee.create({
      name: "Empleado Test",
      email: "empleado@empresa.com",
      password: "empleado123",
      role: "employee",
      department: "Ventas",
      position: "Vendedor",
      phone: "987654321",
    });
    console.log(`✅ Empleado creado: ${employee.email} - ${employee.password}`);
    
    console.log("\n📋 CREDENCIALES:");
    console.log("Admin: admin@empresa.com / admin123");
    console.log("Empleado: empleado@empresa.com / empleado123");
    
    await mongoose.disconnect();
    console.log("✅ Seed completado!");
  } catch (error) {
    console.error("❌ Error:", error);
  }
};

seedEmployees();