import cloudinary from "../config/cloudinary.js";
import { Product } from "../models/product.model.js";
import { Order } from "../models/order.model.js";
import { User } from "../models/user.model.js";

/**
 * Función auxiliar para extraer el public_id de Cloudinary.
 * Maneja URLs con o sin carpetas de forma segura.
 */
const getPublicId = (url) => {
  if (!url) return null;
  const parts = url.split("/");
  // Obtenemos "products/nombre_imagen" eliminando la extensión
  const folder = parts[parts.length - 2];
  const fileName = parts[parts.length - 1].split(".")[0];
  return `${folder}/${fileName}`;
};

// --- PRODUCTOS ---

export async function createProduct(req, res) {
  try {
    const { name, description, price, stock, category } = req.body;

    if (!name || !description || !price || !stock || !category) {
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "Se requiere al menos una imagen" });
    }

    // Subida paralela a Cloudinary
    const uploadPromises = req.files.map((file) =>
      cloudinary.uploader.upload(file.path, { folder: "products" })
    );
    const uploadResults = await Promise.all(uploadPromises);
    const imageUrls = uploadResults.map((result) => result.secure_url);

    const product = await Product.create({
      name,
      description,
      price: parseFloat(price),
      stock: parseInt(stock),
      category,
      images: imageUrls,
    });

    res.status(201).json(product);
  } catch (error) {
    console.error("Error al crear producto:", error);
    res.status(500).json({ message: "Error interno al crear producto" });
  }
}

export async function getAllProducts(req, res) {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener productos" });
  }
}

export async function updateProduct(req, res) {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Producto no encontrado" });

    // Actualizar imágenes si vienen archivos nuevos
    if (req.files && req.files.length > 0) {
      // 1. Borrar imágenes anteriores de Cloudinary
      if (product.images && product.images.length > 0) {
        const deletePromises = product.images.map((url) =>
          cloudinary.uploader.destroy(getPublicId(url))
        );
        await Promise.all(deletePromises);
      }

      // 2. Subir las nuevas
      const uploadPromises = req.files.map((file) =>
        cloudinary.uploader.upload(file.path, { folder: "products" })
      );
      const uploadResults = await Promise.all(uploadPromises);
      product.images = uploadResults.map((result) => result.secure_url);
    }

    // Actualizar el resto de campos si existen en el body
    const fieldsToUpdate = ["name", "description", "category", "price", "stock"];
    fieldsToUpdate.forEach((field) => {
      if (req.body[field] !== undefined) {
        if (field === "price") product[field] = parseFloat(req.body[field]);
        else if (field === "stock") product[field] = parseInt(req.body[field]);
        else product[field] = req.body[field];
      }
    });

    await product.save();
    res.status(200).json(product);
  } catch (error) {
    console.error("Error al actualizar:", error);
    res.status(500).json({ message: "Error al actualizar producto" });
  }
}

export async function deleteProduct(req, res) {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Producto no encontrado" });

    // Limpiar Cloudinary
    if (product.images && product.images.length > 0) {
      const deletePromises = product.images.map((url) =>
        cloudinary.uploader.destroy(getPublicId(url))
      );
      await Promise.all(deletePromises);
    }

    await Product.findByIdAndDelete(id);
    res.status(200).json({ message: "Producto eliminado con éxito" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar producto" });
  }
}

// --- ÓRDENES ---

export async function getAllOrders(req, res) {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("orderItems.product")
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener órdenes" });
  }
}

export async function updateOrderStatus(req, res) {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Orden no encontrada" });

    order.status = status;
    if (status === "shipped") order.shippedAt = new Date();
    if (status === "delivered") order.deliveredAt = new Date();

    await order.save();
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar estado" });
  }
}

// --- CLIENTES ---

export async function getAllCustomers(_, res) {
  try {
    const customers = await User.find().sort({ createdAt: -1 });
    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener clientes" });
  }
}

// --- ESTADÍSTICAS ---

export async function getDashboardStats(_, res) {
  try {
    const [totalOrders, totalCustomers, totalProducts, revenue] = await Promise.all([
      Order.countDocuments(),
      User.countDocuments(),
      Product.countDocuments(),
      Order.aggregate([
        { $group: { _id: null, total: { $sum: "$totalPrice" } } }
      ])
    ]);

    res.status(200).json({
      totalRevenue: revenue[0]?.total || 0,
      totalOrders,
      totalCustomers,
      totalProducts,
    });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener estadísticas" });
  }
}