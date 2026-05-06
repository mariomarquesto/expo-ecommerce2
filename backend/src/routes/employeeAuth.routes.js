// backend/src/routes/employeeAuth.routes.js
import express from "express";
import jwt from "jsonwebtoken";
import { Employee } from "../models/employee.model.js";

const router = express.Router();

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const employee = await Employee.findOne({ email });
    if (!employee) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }
    
    const isValid = await employee.comparePassword(password);
    if (!isValid) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }
    
    if (!employee.isActive) {
      return res.status(401).json({ message: "Cuenta desactivada" });
    }
    
    // Generar token JWT
    const token = jwt.sign(
      { id: employee._id, email: employee.email, role: employee.role },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "7d" }
    );
    
    res.json({
      success: true,
      token,
      employee: {
        id: employee._id,
        name: employee.name,
        email: employee.email,
        role: employee.role,
        department: employee.department,
        position: employee.position,
      }
    });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ message: "Error interno" });
  }
});

// Verificar token
router.get("/verify", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No autorizado" });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secretkey");
    const employee = await Employee.findById(decoded.id).select("-password");
    
    if (!employee) {
      return res.status(401).json({ message: "Usuario no encontrado" });
    }
    
    res.json({ success: true, employee });
  } catch (error) {
    res.status(401).json({ message: "Token inválido" });
  }
});

// Registrar empleado (solo admin puede crear)
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, department, position, phone, role } = req.body;
    
    const existing = await Employee.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email ya registrado" });
    }
    
    const employee = await Employee.create({
      name,
      email,
      password,
      department,
      position,
      phone,
      role: role || "employee",
    });
    
    res.status(201).json({
      success: true,
      employee: {
        id: employee._id,
        name: employee.name,
        email: employee.email,
        role: employee.role,
      }
    });
  } catch (error) {
    console.error("Error en registro:", error);
    res.status(500).json({ message: "Error interno" });
  }
});

export default router;