import cloudinary from "../config/cloudinary.js";
import { Product } from "../models/product.model.js";
import { Order } from "../models/order.model.js";
import { User } from "../models/user.model.js";

/**
 * Función auxiliar para extraer el public_id de Cloudinary.
 */
const getPublicId = (url) => {
  if (!url) return null;
  const parts = url.split("/");
  const folder = parts[parts.length - 2];
  const fileName = parts[parts.length - 1].split(".")[0];
  return `${folder}/${fileName}`;
};

// --- PRODUCTOS ---

export async function createProduct(req, res) {
  try {
    let { name, description, price, stock, category, images } = req.body;

    if (!name || !description || !price || !stock || !category) {
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    let imageUrls = [];

    if (images) {
      if (typeof images === 'string') {
        imageUrls = [images];
      } else if (Array.isArray(images)) {
        imageUrls = images;
      }
    } else if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map((file) =>
        cloudinary.uploader.upload(file.path, { folder: "products" })
      );
      const uploadResults = await Promise.all(uploadPromises);
      imageUrls = uploadResults.map((result) => result.secure_url);
    } else {
      return res.status(400).json({ message: "Se requiere al menos una imagen o URL de imagen" });
    }

    const product = await Product.create({
      name,
      description,
      price: parseFloat(price),
      stock: parseInt(stock),
      category,
      images: imageUrls,
    });

    res.status(201).json({
      success: true,
      product
    });
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

    const { name, description, price, stock, category, images } = req.body;

    // Actualizar imágenes si vienen URLs
    if (images) {
      if (typeof images === 'string') {
        product.images = [images];
      } else if (Array.isArray(images)) {
        product.images = images;
      }
    }
    // Actualizar imágenes si vienen archivos
    else if (req.files && req.files.length > 0) {
      if (product.images && product.images.length > 0) {
        const deletePromises = product.images.map((url) =>
          cloudinary.uploader.destroy(getPublicId(url))
        );
        await Promise.all(deletePromises);
      }

      const uploadPromises = req.files.map((file) =>
        cloudinary.uploader.upload(file.path, { folder: "products" })
      );
      const uploadResults = await Promise.all(uploadPromises);
      product.images = uploadResults.map((result) => result.secure_url);
    }

    // Actualizar otros campos
    if (name) product.name = name;
    if (description) product.description = description;
    if (price) product.price = parseFloat(price);
    if (stock !== undefined) product.stock = parseInt(stock);
    if (category) product.category = category;

    await product.save();
    res.status(200).json({
      success: true,
      product
    });
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