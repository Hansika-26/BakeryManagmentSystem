import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // e.g. "Cakes"
  image: { type: String } // e.g. "cake.png"
});

const Category = mongoose.models.Category || mongoose.model("Category", categorySchema);
export default Category;
