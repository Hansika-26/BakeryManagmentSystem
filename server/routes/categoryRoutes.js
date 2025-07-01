import express from "express";
import { getCategories, addCategory } from "../controllers/categoryController.js";
import { authenticateUser, authorizePermissions } from "../middleware/userAuth.js";

const router = express.Router();

router.get("/", getCategories);

// Protect this route: first authenticate user, then authorize by role
router.post("/", authenticateUser, authorizePermissions("admin"), addCategory);

export default router;
