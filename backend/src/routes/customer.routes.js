import express from "express";
import { Customer } from "../models/customer.model.js";

const router = express.Router();

// 1. Obtener todos los clientes (con opción de búsqueda)
// GET: http://localhost:3000/api/customers?search=mario
router.get("/", async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};

    if (search) {
      // Busca coincidencias parciales en el nombre (ignora mayúsculas/minúsculas)
      query = { name: { $regex: search, $options: "i" } };
    }

    const customers = await Customer.find(query).sort({ createdAt: -1 });
    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener clientes", error: error.message });
  }
});

// 2. Obtener un cliente específico por ID
router.get("/:id", async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ message: "Cliente no encontrado" });
    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({ message: "Error al buscar el cliente", error: error.message });
  }
});

// 3. Crear un nuevo cliente
router.post("/", async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;

    // Validación básica: Ver si ya existe el email
    const exists = await Customer.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "El email ya está registrado" });
    }

    const newCustomer = new Customer({ name, email, phone, address });
    await newCustomer.save();

    res.status(201).json(newCustomer);
  } catch (error) {
    res.status(400).json({ message: "Error al crear cliente", error: error.message });
  }
});

// 4. Actualizar datos de un cliente
router.put("/:id", async (req, res) => {
  try {
    const updatedCustomer = await Customer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // Para que devuelva el objeto ya modificado
    );
    res.status(200).json(updatedCustomer);
  } catch (error) {
    res.status(400).json({ message: "Error al actualizar", error: error.message });
  }
});

export default router;