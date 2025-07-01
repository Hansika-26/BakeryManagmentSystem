import express from "express";
import { getProducts, addProduct, updateProduct, deleteProduct } from "../controllers/productController.js";
const router = express.Router();

router.get("/", getProducts);
router.post("/", addProduct);
router.put("/:id", updateProduct);      // <-- This line is needed
router.delete("/:id", deleteProduct);   // <-- This line is needed

export default router;