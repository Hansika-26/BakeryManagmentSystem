import express from "express";
import { getCategories, addCategory, updateCategory, deleteCategory } from "../controllers/categoryController.js";
import { authenticateUser, authorizePermissions } from "../middleware/userAuth.js";

const router = express.Router();

router.get("/", getCategories);

// Protect this route: first authenticate user, then authorize by role
router.post("/", authenticateUser, authorizePermissions("admin"), addCategory);

//TODO: Implement updateCategory and deleteCategory route it must be a admin permises
router.patch("/:id", authenticateUser, authorizePermissions("admin"), updateCategory);

router.delete("/:id", authenticateUser, authorizePermissions("admin"), deleteCategory);

export default router;
