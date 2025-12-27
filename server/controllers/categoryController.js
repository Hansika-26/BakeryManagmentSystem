import Category from "../model/categoryModel.js";
import { addCategoryValidator, updateCategoryValidator } from '../validators/categoryValidation.js';

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();

    if (!categories || categories.length === 0) {
      return res.json({ success: false, message: "No categories found" });
    }
    res.status(200).json(categories);

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const addCategory = async (req, res) => {
  try {
    //TODO: Validate the request body
    const { name } = req.body;

    const { error } = addCategoryValidator.validate({ name });

    if (error) {
      return res.status(400).json({ success: false, message: error.details[0].message });
    }

    // ✅ Save to DB
    const category = new Category({ name });
    await category.save();

    res.status(200).json({
      success: true,
      message: "Category added successfully",
      category,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//TODO: Implement updateCategory(with validation) and deleteCategory functions 
export const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  // Validate input
  const { error } = updateCategoryValidator.validate({ name });
  if (error) {
    return res.status(400).json({ success: false, message: error.details[0].message });
  }

  try {
    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { name },
      { new: true, runValidators: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      category: updatedCategory,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteCategory = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedCategory = await Category.findByIdAndDelete(id);

    if (!deletedCategory) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
      category: deletedCategory,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};