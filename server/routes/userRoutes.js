import express from 'express';
import { authorizePermissions } from "../middleware/userAuth.js";
import { getAllUsers } from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.get('/all',authorizePermissions("admin"), getAllUsers); 

export default userRouter;
