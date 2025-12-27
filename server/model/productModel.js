import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  image: { type: String }, // e.g. "chocolate-cake.png"
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
  isActive: { type: Boolean, default: true } // Admin can hide products when out of stock
});

const Product = mongoose.models.Product || mongoose.model("Product", productSchema);
export default Product;