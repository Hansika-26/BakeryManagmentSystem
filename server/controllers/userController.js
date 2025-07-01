import userModel from "../model/userModel.js";

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
