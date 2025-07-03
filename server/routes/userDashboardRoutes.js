import express from 'express';
import { authenticateUser } from '../middleware/userAuth.js'; // ✅ Use the named export
import User from '../model/userModel.js';
import Category from '../model/categoryModel.js';
import Product from '../model/productModel.js';

const router = express.Router();

// GET /api/user/dashboard
router.get('/dashboard', authenticateUser, async (req, res) => {
  try {
    // Get user info
    const user = await User.findById(req.userId).select('-password');
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    // Get categories and products
    const categories = await Category.find();
    const products = await Product.find();

    res.json({
      success: true,
      user,
      categories,
      products
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
});



export default router;
