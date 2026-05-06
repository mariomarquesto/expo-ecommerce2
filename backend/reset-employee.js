import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const resetEmployee = async () => {
  try {
    // Conectar a MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Conectado a MongoDB");

    // Obtener el modelo Employee dinámicamente
    const employeeSchema = new mongoose.Schema({
      name: String,
      email: String,
      password: String,
      role: String,
      department: String,
      position: String,
      phone: String,
      isActive: Boolean,
    });
    
    const Employee = mongoose.model("Employee", employeeSchema, "employees");

    const email = "ana.gonzalez@empresa.com";
    const newPassword = "ana123";
    
    // Generar hash de la contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Actualizar el empleado
    const result = await Employee.updateOne(
      { email: email },
      { $set: { password: hashedPassword } }
    );
    
    if (result.modifiedCount > 0) {
      console.log(`✅ Contraseña actualizada para ${email}`);
    } else if (result.matchedCount > 0) {
      console.log(`⚠️ Usuario encontrado pero la contraseña ya estaba bien`);
    } else {
      console.log(`❌ Usuario no encontrado: ${email}`);
    }
    
    // Mostrar todos los empleados
    const allEmployees = await Employee.find({}, { email: 1, name: 1, role: 1 });
    console.log("\n📋 EMPLEADOS EN BASE DE DATOS:");
    console.table(allEmployees);
    
    await mongoose.disconnect();
    console.log("✅ Proceso completado");
  } catch (error) {
    console.error("❌ Error:", error);
  }
};

resetEmployee();