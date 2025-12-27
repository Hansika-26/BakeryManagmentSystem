import Product from "../model/productModel.js";
import Category from '../model/categoryModel.js';
import { addProductValidator, updateProductValidator } from '../validators/productValidation.js';

// TODO : create product  / update product
// * product details must be validaate using JOI library
// * check product category must be exist in database if not return error - logic 
// * product image must be upload into clodnary platform  and url must be save on database

// TODO : get all product, get product by category(filter by category), get product by id
// delete product - not consider


export const getProducts = async (req, res) => {
  try {
    const filter = {};

    // ✅ TODO: Get Product by Category
    if (req.query.category) {
      filter.category = req.query.category;
    }

    // ✅ Filter: Only show active products for regular users
    // Admin can see all products (checked via role in frontend)
    if (req.query.showAll !== 'true') {
      filter.isActive = true;
    }

    // ✅ TODO: Get All Products (if no category filter)
    const products = await Product.find(filter).populate("category");

    res.status(200).json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ TODO: Get Product by ID
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id).populate("category");

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/*
export const addProduct = async (req, res) => {
  try {
    const { name, description, price, image, category } = req.body;

    // ✅ Validate request
    const { error } = addProductValidator.validate({
      name,
      description,
      price,
      image,
      category,
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    // ✅ Save to database
    const product = new Product({ name, description, price, image, category });
    await product.save();

    res.status(200).json({
      success: true,
      message: 'Product added successfully',
      product,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

*/

/*
export const addProduct = async (req, res) => {
  try {
    const { name, description, price, image, category } = req.body;

    // ✅ 1. Validate product data
    const { error } = addProductValidator.validate({ name, description, price, image, category });
    if (error) {
      return res.status(400).json({ success: false, message: error.details[0].message });
    }

    // ✅ 2. Check if category exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(404).json({ success: false, message: 'Category does not exist' });
    }

    // ✅ 3. Save product to DB
    const product = new Product({ name, description, price, image, category });
    await product.save();

    res.status(200).json({
      success: true,
      message: 'Product added successfully',
      product,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
*/
export const addProduct = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;

    // ✅ Image uploaded by multer, file path contains Cloudinary URL
    const image = req.file?.path;

    const { error } = addProductValidator.validate({ name, description, price, image, category });
    if (error) {
      return res.status(400).json({ success: false, message: error.details[0].message });
    }

    // ✅ 2. Check if category exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(404).json({ success: false, message: 'Category does not exist' });
    }



    const product = new Product({
      name,
      description,
      price,
      image, // Cloudinary URL
      category,
    });

    await product.save();

    res.status(200).json({
      success: true,
      message: 'Product added with image',
      product,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


/*
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, image, category } = req.body;

    // ✅ Validate request data
    const { error } = updateProductValidator.validate({
      name,
      description,
      price,
      image,
      category,
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const product = await Product.findByIdAndUpdate(
      id,
      { name, description, price, image, category },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.status(200).json({ success: true, message: 'Product updated successfully', product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};*/

export const updateProduct = async (req, res) => {
  console.log("🟡 updateProduct triggered");
  console.log("🟡 Incoming req.body:", req.body);
  try {
    const { id } = req.params;
    const { name, description, price, category } = req.body;

    // ✅ Image uploaded by multer, file path contains Cloudinary URL
    const image = req.file?.path;

    // ✅ 1. Validate request body
    const { error } = updateProductValidator.validate({ name, description, price, image, category });
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    // ✅ 2. If category is provided, check if it exists
    if (category) {
      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        return res.status(404).json({ success: false, message: 'Category does not exist' });
      }
    }

    // ✅ 3. Update product
    const product = await Product.findByIdAndUpdate(
      id,
      { name, description, price, image, category },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      product,
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    res.json({ success: true, message: "Product deleted" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ✅ Toggle product visibility (hide/show from customers)
export const toggleProductVisibility = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Toggle isActive status
    product.isActive = !product.isActive;
    await product.save();

    res.status(200).json({
      success: true,
      message: `Product ${product.isActive ? 'shown' : 'hidden'} successfully`,
      product,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};