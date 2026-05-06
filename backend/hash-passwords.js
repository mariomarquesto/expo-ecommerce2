// backend/hash-passwords.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const hashPasswords = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Conectado a MongoDB");

    const db = mongoose.connection.db;
    const collection = db.collection("employees");

    // Obtener todos los empleados
    const employees = await collection.find({}).toArray();
    console.log(`📋 Encontrados ${employees.length} empleados`);

    for (const employee of employees) {
      // Si la contraseña no parece un hash de bcrypt ($2a$, $2b$, etc.)
      if (!employee.password || !employee.password.startsWith("$2")) {
        const hashedPassword = await bcrypt.hash(employee.password, 10);
        
        await collection.updateOne(
          { _id: employee._id },
          { $set: { password: hashedPassword } }
        );
        
        console.log(`✅ Contraseña hasheada para: ${employee.email}`);
      } else {
        console.log(`⚠️ La contraseña ya está hasheada para: ${employee.email}`);
      }
    }

    console.log("\n✅ Proceso completado");
    await mongoose.disconnect();
  } catch (error) {
    console.error("❌ Error:", error);
  }
};

hashPasswords();