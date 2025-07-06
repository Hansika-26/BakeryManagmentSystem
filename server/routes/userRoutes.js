import express from 'express';
import { getAllUsers,getCurrentUser, updateUserProfile, deleteUserProfile  } from '../controllers/userController.js';
import { authenticateUser } from '../middleware/userAuth.js';
//import User from '../model/userModel.js';
//import bcrypt from 'bcryptjs';

const userRouter = express.Router();

userRouter.get('/all', getAllUsers); 

userRouter.get("/data", authenticateUser, getCurrentUser);
userRouter.put("/profile", authenticateUser, updateUserProfile);
userRouter.delete("/profile", authenticateUser, deleteUserProfile);

// Delete user profile
/*
userRouter.delete('/profile', authenticateUser, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.user.userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    res.json({ success: true, message: "User deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
});
*/
export default userRouter;
