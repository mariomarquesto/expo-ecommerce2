import mongoose from "mongoose";
import { Product } from "../models/product.model.js";
import { Customer } from "../models/customer.model.js";
import { Order } from "../models/order.model.js";
import { ENV } from "../config/env.js";

const products = [
  {
    name: "Wireless Bluetooth Headphones",
    description: "Premium over-ear headphones with active noise cancellation, 30-hour battery life, and premium sound quality.",
    price: 149.99,
    stock: 50,
    category: "Electronics",
    images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500"],
  },
  {
    name: "Smart Watch Series 5",
    description: "Advanced fitness tracking, heart rate monitor, GPS, and water-resistant design.",
    price: 299.99,
    stock: 35,
    category: "Electronics",
    images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500"],
  },
  {
    name: "Leather Crossbody Bag",
    description: "Handcrafted genuine leather bag with adjustable strap. Elegant design perfect for daily use.",
    price: 89.99,
    stock: 25,
    category: "Fashion",
    images: ["https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500"],
  }
];

const customers = [
  {
    name: "Juan Pérez",
    email: "juan.perez@email.com",
    phone: "3814556677",
    address: "Av. Alem 1234, Tucumán"
  },
  {
    name: "Gabriela Gómez",
    email: "gabi.gomez@email.com",
    phone: "381998877",
    address: "Calle Falsa 123"
  }
];

const seedDatabase = async () => {
  try {
    console.log("⏳ Intentando conectar a MongoDB Atlas...");
    await mongoose.connect(ENV.MONGO_URI);
    console.log("✅ Conectado exitosamente a MongoDB");

    // 1. Limpiar TODA la base de datos
    await Product.deleteMany({});
    await Customer.deleteMany({});
    await Order.deleteMany({});
    console.log("🗑️  Base de datos limpia (Productos, Clientes y Órdenes eliminados)");

    // 2. Insertar Productos y Clientes
    const createdProducts = await Product.insertMany(products);
    const createdCustomers = await Customer.insertMany(customers);
    console.log(`✅ ${createdProducts.length} productos y ${createdCustomers.length} clientes insertados`);

    // 3. Crear una Orden de prueba vinculada
    // IMPORTANTE: Ajustado para cumplir con las validaciones de tu Order Model
    const orderData = {
      user: createdCustomers[0]._id, // ID del cliente (referencia a User)
      clerkId: "user_2test_clerk_998877", // Simulación de ID de Clerk
      orderItems: [
        {
          product: createdProducts[0]._id,
          name: createdProducts[0].name,
          price: createdProducts[0].price,
          quantity: 2,
          image: createdProducts[0].images[0]
        }
      ],
      shippingAddress: {
        fullName: createdCustomers[0].name,
        streetAddress: "Av. Alem 1234",
        city: "San Miguel de Tucumán",
        state: "Tucumán",
        zipCode: "4000",
        phoneNumber: createdCustomers[0].phone
      },
      totalPrice: createdProducts[0].price * 2,
      status: "pending", // Debe ser: pending, shipped o delivered según tu enum
    };

    await Order.create(orderData);
    console.log("🛒 Orden de prueba creada con éxito");

    await mongoose.connection.close();
    console.log("🔌 Conexión cerrada. Proceso finalizado.");
    process.exit(0);

  } catch (error) {
    console.error("\n❌ Error crítico durante el seeding:");
    console.error(error.message);
    process.exit(1);
  }
};

seedDatabase();