// backend/src/controllers/product.controller.js

import { Product } from "../models/product.model.js";

// 1. Función para obtener TODOS los productos (La que usa Mobile)
export const getMobileProducts = async (req, res) => {
  try {
    const products = await Product.find();

    if (!products || products.length === 0) {
      return res.status(404).json({ message: "No se encontraron productos" });
    }

    res.status(200).json(products);
  } catch (error) {
    console.error("Error en getMobileProducts:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// 2. Función para obtener UN producto por ID (La que ya tenías)
export async function getProductById(req, res) {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) return res.status(404).json({ message: "Product not found" });

    res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}