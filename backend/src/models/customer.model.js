import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    address: { type: String },
  },
  { timestamps: true }
);

// ¡ESTA LÍNEA ES LA CLAVE! 
// Debe tener el 'export' antes de la 'const'
export const Customer = mongoose.model("Customer", customerSchema);