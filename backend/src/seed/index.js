import mongoose from "mongoose";
import { Product } from "../models/product.model.js";
import { Customer } from "../models/customer.model.js";
import { Order } from "../models/order.model.js";
import { Employee } from "../models/employee.model.js";
import { ENV } from "../config/env.js";

// ==================== PRODUCTOS ====================
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
  },
  {
    name: "Ultrabook Laptop X1",
    description: "Lightweight laptop with 16GB RAM, 512GB SSD, and 14-inch 4K display. Perfect for professionals.",
    price: 1299.99,
    stock: 15,
    category: "Electronics",
    images: ["https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500"],
  },
  {
    name: "Running Shoes Pro",
    description: "Professional running shoes with cushioning technology, breathable mesh, and durable sole.",
    price: 119.99,
    stock: 40,
    category: "Sports",
    images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500"],
  },
  {
    name: "Coffee Maker Deluxe",
    description: "Programmable coffee maker with thermal carafe, brew strength control, and self-cleaning function.",
    price: 79.99,
    stock: 30,
    category: "Home",
    images: ["https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=500"],
  },
  {
    name: "Yoga Mat Premium",
    description: "Non-slip yoga mat with alignment lines, eco-friendly material, and carrying strap.",
    price: 39.99,
    stock: 60,
    category: "Sports",
    images: ["https://images.unsplash.com/photo-1592432678016-e910b452f9a2?w=500"],
  },
  {
    name: "Desk Lamp LED",
    description: "Adjustable LED desk lamp with touch control, USB charging port, and 5 lighting modes.",
    price: 49.99,
    stock: 45,
    category: "Home",
    images: ["https://images.unsplash.com/photo-1507473885765-e6b057e78278?w=500"],
  },
  {
    name: "Backpack Urban",
    description: "Water-resistant backpack with laptop compartment, multiple pockets, and ergonomic design.",
    price: 69.99,
    stock: 55,
    category: "Accessories",
    images: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500"],
  },
  {
    name: "Sunglasses Classic",
    description: "Polarized sunglasses with UV400 protection, lightweight frame, and stylish design.",
    price: 59.99,
    stock: 70,
    category: "Fashion",
    images: ["https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500"],
  },
  {
    name: "Gaming Mouse RGB",
    description: "High-precision gaming mouse with RGB lighting, 7 programmable buttons, and 16000 DPI.",
    price: 45.99,
    stock: 80,
    category: "Electronics",
    images: ["https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500"],
  },
  {
    name: "Water Bottle 1L",
    description: "Stainless steel insulated water bottle, keeps drinks cold for 24 hours or hot for 12 hours.",
    price: 24.99,
    stock: 100,
    category: "Sports",
    images: ["https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500"],
  },
  {
    name: "Wireless Keyboard",
    description: "Compact wireless keyboard with quiet keys, long battery life, and USB receiver.",
    price: 34.99,
    stock: 65,
    category: "Electronics",
    images: ["https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500"],
  },
  {
    name: "Throw Pillow Set",
    description: "Set of 2 decorative throw pillows with soft velvet cover and removable insert.",
    price: 29.99,
    stock: 40,
    category: "Home",
    images: ["https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=500"],
  },
];

// ==================== CLIENTES ====================
const customers = [
  { name: "Juan Pérez", email: "juan.perez@email.com", phone: "3814556677", address: "Av. Alem 1234, Tucumán" },
  { name: "Gabriela Gómez", email: "gabi.gomez@email.com", phone: "381998877", address: "Calle Falsa 123, Tucumán" },
  { name: "Carlos Rodríguez", email: "carlos.rodriguez@email.com", phone: "3812345678", address: "Av. Belgrano 456, Tucumán" },
  { name: "María López", email: "maria.lopez@email.com", phone: "3813456789", address: "San Martín 789, Tucumán" },
  { name: "José Fernández", email: "jose.fernandez@email.com", phone: "3814567890", address: "Av. Independencia 101, Tucumán" },
  { name: "Ana Martínez", email: "ana.martinez@email.com", phone: "3815678901", address: "24 de Septiembre 202, Tucumán" },
  { name: "Miguel Sánchez", email: "miguel.sanchez@email.com", phone: "3816789012", address: "Laprida 303, Tucumán" },
  { name: "Laura González", email: "laura.gonzalez@email.com", phone: "3817890123", address: "Av. Roca 404, Tucumán" },
  { name: "Diego Ramírez", email: "diego.ramirez@email.com", phone: "3818901234", address: "Mendoza 505, Tucumán" },
  { name: "Sofía Torres", email: "sofia.torres@email.com", phone: "3819012345", address: "Av. Sarmiento 606, Tucumán" },
  { name: "Pablo Díaz", email: "pablo.diaz@email.com", phone: "3810123456", address: "Córdoba 707, Tucumán" },
  { name: "Lucía Flores", email: "lucia.flores@email.com", phone: "3811234567", address: "Av. Mitre 808, Tucumán" },
  { name: "Andrés Morales", email: "andres.morales@email.com", phone: "3812345678", address: "Catamarca 909, Tucumán" },
  { name: "Valentina Ortiz", email: "valentina.ortiz@email.com", phone: "3813456789", address: "Av. Leandro N. Alem 1010, Tucumán" },
  { name: "Ricardo Silva", email: "ricardo.silva@email.com", phone: "3814567890", address: "Chile 1111, Tucumán" },
  { name: "Camila Castro", email: "camila.castro@email.com", phone: "3815678901", address: "Av. España 1212, Tucumán" },
  { name: "Fernando Ríos", email: "fernando.rios@email.com", phone: "3816789012", address: "Bolivia 1313, Tucumán" },
  { name: "Julieta Medina", email: "julieta.medina@email.com", phone: "3817890123", address: "Av. Aconquija 1414, Tucumán" },
  { name: "Gustavo Vega", email: "gustavo.vega@email.com", phone: "3818901234", address: "Salta 1515, Tucumán" },
  { name: "Florencia Acosta", email: "florencia.acosta@email.com", phone: "3819012345", address: "Av. Jujuy 1616, Tucumán" },
];

// ==================== EMPLEADOS ====================
const employees = [
  {
    name: "Administrador Principal",
    email: "admin@empresa.com",
    password: "admin123",
    role: "admin",
    department: "IT",
    position: "Administrador del Sistema",
    phone: "3815550100",
    isActive: true,
  },
  {
    name: "Mario Marquestó",
    email: "mario@empresa.com",
    password: "mario123",
    role: "admin",
    department: "IT",
    position: "Desarrollador Senior",
    phone: "3815550101",
    isActive: true,
  },
  {
    name: "Ana González",
    email: "ana.gonzalez@empresa.com",
    password: "ana123",
    role: "employee",
    department: "Ventas",
    position: "Vendedora Senior",
    phone: "3815550102",
    isActive: true,
  },
  {
    name: "Carlos López",
    email: "carlos.lopez@empresa.com",
    password: "carlos123",
    role: "employee",
    department: "Soporte",
    position: "Soporte Técnico",
    phone: "3815550103",
    isActive: true,
  },
  {
    name: "Laura Martínez",
    email: "laura.martinez@empresa.com",
    password: "laura123",
    role: "employee",
    department: "Logística",
    position: "Coordinadora de Logística",
    phone: "3815550104",
    isActive: true,
  },
  {
    name: "Pedro Fernández",
    email: "pedro.fernandez@empresa.com",
    password: "pedro123",
    role: "employee",
    department: "Ventas",
    position: "Vendedor",
    phone: "3815550105",
    isActive: true,
  },
  {
    name: "Silvia Ramírez",
    email: "silvia.ramirez@empresa.com",
    password: "silvia123",
    role: "employee",
    department: "Marketing",
    position: "Analista de Marketing",
    phone: "3815550106",
    isActive: true,
  },
];

const seedDatabase = async () => {
  try {
    console.log("⏳ Conectando a MongoDB...");
    await mongoose.connect(ENV.MONGO_URI);
    console.log("✅ Conectado exitosamente a MongoDB");

    // 1. Limpiar toda la base de datos
    await Product.deleteMany({});
    await Customer.deleteMany({});
    await Order.deleteMany({});
    await Employee.deleteMany({});
    console.log("🗑️ Base de datos limpiada");

    // 2. Insertar productos
    const createdProducts = await Product.insertMany(products);
    console.log(`✅ ${createdProducts.length} productos insertados`);

    // 3. Insertar clientes
    const createdCustomers = await Customer.insertMany(customers);
    console.log(`✅ ${createdCustomers.length} clientes insertados`);

    // 4. Insertar empleados
    const createdEmployees = await Employee.insertMany(employees);
    console.log(`✅ ${createdEmployees.length} empleados insertados`);

    // 5. Generar órdenes
    const statuses = ["pending", "shipped", "delivered"];
    const orders = [];
    
    for (let i = 0; i < 30; i++) {
      const customer = createdCustomers[Math.floor(Math.random() * createdCustomers.length)];
      const numItems = Math.floor(Math.random() * 3) + 1;
      const selectedProducts = [];
      let totalPrice = 0;
      
      for (let j = 0; j < numItems; j++) {
        const product = createdProducts[Math.floor(Math.random() * createdProducts.length)];
        const quantity = Math.floor(Math.random() * 3) + 1;
        const subtotal = product.price * quantity;
        totalPrice += subtotal;
        
        selectedProducts.push({
          product: product._id,
          name: product.name,
          price: product.price,
          quantity: quantity,
          image: product.images[0],
        });
      }
      
      const date = new Date();
      date.setDate(date.getDate() - Math.floor(Math.random() * 30));
      
      orders.push({
        user: customer._id,
        clerkId: `clerk_${customer._id.toString().slice(-8)}`,
        orderItems: selectedProducts,
        shippingAddress: {
          fullName: customer.name,
          streetAddress: customer.address,
          city: "San Miguel de Tucumán",
          state: "Tucumán",
          zipCode: "4000",
          phoneNumber: customer.phone,
        },
        totalPrice: parseFloat(totalPrice.toFixed(2)),
        status: statuses[Math.floor(Math.random() * statuses.length)],
        createdAt: date,
        updatedAt: date,
      });
    }
    
    const createdOrders = await Order.insertMany(orders);
    console.log(`✅ ${createdOrders.length} órdenes insertadas`);

    // 6. Estadísticas finales
    console.log("\n📊 RESUMEN FINAL:");
    console.log(`   - Productos: ${createdProducts.length}`);
    console.log(`   - Clientes: ${createdCustomers.length}`);
    console.log(`   - Empleados: ${createdEmployees.length}`);
    console.log(`   - Órdenes: ${createdOrders.length}`);
    
    const totalRevenue = createdOrders.reduce((sum, order) => sum + order.totalPrice, 0);
    console.log(`   - Ingresos totales: $${totalRevenue.toFixed(2)}`);
    
    const pendingOrders = createdOrders.filter(o => o.status === "pending").length;
    const shippedOrders = createdOrders.filter(o => o.status === "shipped").length;
    const deliveredOrders = createdOrders.filter(o => o.status === "delivered").length;
    
    console.log(`   - Órdenes pendientes: ${pendingOrders}`);
    console.log(`   - Órdenes enviadas: ${shippedOrders}`);
    console.log(`   - Órdenes entregadas: ${deliveredOrders}`);
    
    console.log("\n👥 CREDENCIALES DE EMPLEADOS:");
    console.log("========================================");
    employees.forEach(emp => {
      console.log(`${emp.role.toUpperCase()}: ${emp.email} / ${emp.password}`);
    });
    console.log("========================================");

    await mongoose.connection.close();
    console.log("\n🔌 Conexión cerrada. ¡Seed completado exitosamente!");
    process.exit(0);

  } catch (error) {
    console.error("\n❌ Error crítico durante el seeding:");
    console.error(error.message);
    process.exit(1);
  }
};

seedDatabase();