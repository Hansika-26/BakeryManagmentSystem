import Category from "../model/categoryModel.js";

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json({ success: true, categories });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const addCategory = async (req, res) => {
  try {
    const { name, image } = req.body;
    const category = new Category({ name, image });
    await category.save();
    res.json({ success: true, category });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};