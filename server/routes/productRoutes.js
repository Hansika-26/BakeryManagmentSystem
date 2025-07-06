import express from "express";
import upload from '../middleware/upload.js';
import { getProducts, addProduct, updateProduct, deleteProduct, getProductById} from "../controllers/productController.js";
import { authenticateUser, authorizePermissions } from '../middleware/userAuth.js';

const router = express.Router();

router.get('/', getProducts);           // Get all products or by category
router.get('/:id', getProductById);
//router.post("/", addProduct);
router.patch("/:id", authenticateUser, authorizePermissions('admin'),upload.single('image'), updateProduct);   
router.delete("/:id",authenticateUser, authorizePermissions('admin'), deleteProduct);   
router.post('/', authenticateUser, authorizePermissions('admin'), upload.single('image'), addProduct);

export default router;

