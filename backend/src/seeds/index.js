import mongoose from "mongoose";
import { Product } from "../models/product.model.js";
import { ENV } from "../config/env.js";

const products = [
  {
    name: "Wireless Bluetooth Headphones",
    description: "Premium over-ear headphones with active noise cancellation, 30-hour battery life, and premium sound quality.",
    price: 149.99,
    stock: 50,
    category: "Electronics",
    images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500"],
    averageRating: 4.5,
    totalReviews: 128,
  },
  {
    name: "Smart Watch Series 5",
    description: "Advanced fitness tracking, heart rate monitor, GPS, and water-resistant design.",
    price: 299.99,
    stock: 35,
    category: "Electronics",
    images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500"],
    averageRating: 4.7,
    totalReviews: 256,
  },
  {
    name: "Leather Crossbody Bag",
    description: "Handcrafted genuine leather bag with adjustable strap. Elegant design perfect for daily use.",
    price: 89.99,
    stock: 25,
    category: "Fashion",
    images: ["https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500"],
    averageRating: 4.3,
    totalReviews: 89,
  },
  {
    name: "Running Shoes - Pro Edition",
    description: "Lightweight running shoes with responsive cushioning and breathable mesh upper.",
    price: 129.99,
    stock: 60,
    category: "Sports",
    images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500"],
    averageRating: 4.6,
    totalReviews: 342,
  },
  {
    name: "Bestselling Mystery Novel",
    description: "A gripping psychological thriller that will keep you on the edge of your seat.",
    price: 24.99,
    stock: 100,
    category: "Books",
    images: ["https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500"],
    averageRating: 4.8,
    totalReviews: 1243,
  }
];

const seedDatabase = async () => {
  try {
    console.log("⏳ Intentando conectar a MongoDB Atlas...");
    
    // UNA SOLA CONEXIÓN con todos los parámetros de seguridad
    await mongoose.connect(ENV.DB_URL, {
      serverSelectionTimeoutMS: 30000, 
      connectTimeoutMS: 30000,
      family: 4, 
    });

    console.log("✅ Conectado exitosamente a MongoDB");

    // 1. Limpiar base de datos
    await Product.deleteMany({});
    console.log("🗑️  Base de datos limpia (Productos eliminados)");

    // 2. Insertar nuevos productos
    await Product.insertMany(products);
    console.log(`✅ Se han insertado ${products.length} productos con éxito`);

    // 3. Resumen
    const categories = [...new Set(products.map((p) => p.category))];
    console.log("\n📊 RESUMEN:");
    console.log(`Total: ${products.length} | Categorías: ${categories.join(", ")}`);

    // 4. Cerrar y salir
    await mongoose.connection.close();
    console.log("🔌 Conexión cerrada. Proceso finalizado.");
    process.exit(0);

  } catch (error) {
    console.error("\n❌ Error crítico durante el seeding:");
    console.error("Mensaje:", error.message);
    
    if (error.message.includes('ReplicaSetNoPrimary') || error.message.includes('whitelist')) {
      console.log("\n👉 REVISIÓN DE SEGURIDAD:");
      console.log("1. Ve a MongoDB Atlas -> Network Access.");
      console.log("2. Asegúrate de que 0.0.0.0/0 esté en verde (ACTIVE).");
      console.log("3. Si persiste, prueba conectarte usando los datos móviles de tu celular.");
    }
    
    process.exit(1);
  }
};

seedDatabase();