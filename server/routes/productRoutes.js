import express from "express";
import { getProducts, addProduct, updateProduct, deleteProduct, getProductById} from "../controllers/productController.js";
const router = express.Router();

router.get('/', getProducts);           // Get all products or by category
router.get('/:id', getProductById);
router.post("/", addProduct);
router.put("/:id", updateProduct);      // <-- This line is needed
router.delete("/:id", deleteProduct);   // <-- This line is needed

export default router;