import { Product } from "../models/product.model.js";

export const getMobileProducts = async (req, res) => {
    try {
        // Traemos solo lo necesario: nombre, precio, stock e imagen
        const products = await Product.find().select("name price stock image description category");
        
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener productos para mobile", error: error.message });
    }
};