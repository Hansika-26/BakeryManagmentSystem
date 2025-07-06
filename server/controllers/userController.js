import userModel from "../model/userModel.js";
import bcrypt from "bcryptjs";
import { updateUserProfileValidator } from '../validators/authValidator.js';

export const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find(); 

    res.json({
      success: true,
      users,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/*
export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.userId; // comes from authenticateUser middleware
    const { name, email, password } = req.body;

    const user = await userModel.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    // Update name/email if provided
    if (name) user.name = name;
    if (email) user.email = email;

    // Update password if provided
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};*/


export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.user.userId; // comes from authenticateUser middleware

    const user = await userModel.findById(userId).select("-password"); // exclude password

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.userId; // from authenticateUser middleware

    //  Joi validation
    const { error } = updateUserProfileValidator.validate(req.body);
    if (error) {
      return res.status(400).json({ success: false, message: error.details[0].message });
    }

    const { name, email, password } = req.body;

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    //  Optional: prevent update if no fields provided
    if (!name && !email && !password) {
      return res.status(400).json({ success: false, message: 'No fields to update' });
    }

    if (name) user.name = name;
    if (email) user.email = email;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const deleteUserProfile = async (req, res) => {
  try {
    const userId = req.user.userId; // comes from authenticateUser middleware

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    await userModel.findByIdAndDelete(userId);

    res.status(200).json({
      success: true,
      message: "User profile deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
