import express from 'express';
import {
  isAuthenticated,
  login,
  logout,
  register,
  resetPassword,
  sendResetOtp,
  sendVerifyOtp,
  verifyEmail
} from '../controllers/authController.js';
//import { loginValidator } from '../validator/authValidator.js';

import { authenticateUser } from "../middleware/userAuth.js";

const authRouter = express.Router();

// Public routes
authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/send-reset-otp', sendResetOtp);
authRouter.post('/reset-password', resetPassword);

// Protected routes (require authentication)
authRouter.post('/logout', authenticateUser, logout);
authRouter.post('/send-verify-otp', authenticateUser, sendVerifyOtp);
authRouter.post('/verify-account', authenticateUser, verifyEmail);
authRouter.get('/is-auth', authenticateUser, isAuthenticated);

export default authRouter;
