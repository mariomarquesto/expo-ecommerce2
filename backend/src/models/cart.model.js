import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },
    slug: { type: String, unique: true } // Útil para URLs amigables
  },
  { timestamps: true }
);

export const Category = mongoose.model("Category", categorySchema);