import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../model/userModel.js';
import transporter from '../config/nodemailer.js';
import { registerSchema, loginValidator } from '../validators/authValidator.js';

// Generate JWT Token
const generateToken = (user) => {
  return jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

//  Register User
export const register = async (req, res) => {

 // Validate request using Joi schema
  const { error, value } = registerSchema.validate(req.body, { abortEarly: false });

  if (error) {
    const errors = error.details.map(detail => detail.message);
    return res.status(400).json({ success: false, message: 'Validation Error', errors });
  }

  const { name, email, password, role } = value;

  //console.log("Registering user:", value);

  // const { name, email, password, role } = req.body;

  // if (!name || !email || !password || !role) {
  //   return res.status(400).json({ success: false, message: 'Missing Details' });
  // }

  try {
    const existingUser = await userModel.findOne({ email });
    //console.log("Registering user:", existingUser);
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new userModel({ name, email, password: hashedPassword, role });

    await user.save();

    const token = generateToken(user);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Send welcome email
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: 'Welcome to our service',
      text: `Welcome to our website. Your account has been created with email: ${email}`, 
    };

    try {
      await transporter.sendMail(mailOptions);
    } catch (emailError) {
      console.error('Email error:', emailError.message);
      return res.status(500).json({ success: false, message: 'User created, but email failed', emailError: emailError.message });
    }

    return res.status(201).json({ success: true });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Login User
export const login = async (req, res) => {
  // TODO : add validation for login
  const { email, password } = req.body;
  const { error } = loginValidator.validate({ email, password });
  if (error) {
    return res.status(400).json({ success: false, message: error.details[0].message });
  }

   

  if (!email || !password)
    return res.status(400).json({ success: false, message: 'Email and password are required' });

  try {
    const user = await userModel.findOne({ email }); 
    if (!user) return res.status(400).json({ success: false, message: 'Invalid email' });


    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ success: false, message: 'Invalid password' });

    const token = generateToken(user);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

//  Logout
export const logout = async (req, res) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
    });
    return res.status(200).json({ success: true, message: 'Logged Out' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

//  Send Email Verification OTP
export const sendVerifyOtp = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await userModel.findById(userId);
    if (user.isAccountVerified) {
      return res.status(400).json({ success: false, message: 'Account Already Verified' });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.verifyOtp = otp;
    user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;

    await user.save();

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: 'Account Verification OTP',
      text: `Your OTP is ${otp}. Verify your account using this OTP.`,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: 'Verification OTP sent to email' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//  Verify Email using OTP
export const verifyEmail = async (req, res) => {
  const { otp } = req.body;
  const userId = req.user.userId;

  if (!userId || !otp) {
    return res.status(400).json({ success: false, message: 'Missing Details' });
  }

  try {
    const user = await userModel.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (!user.verifyOtp || user.verifyOtp !== otp)
      return res.status(400).json({ success: false, message: 'Invalid OTP' });

    if (user.verifyOtpExpireAt < Date.now())
      return res.status(400).json({ success: false, message: 'OTP Expired' });

    user.isAccountVerified = true;
    user.verifyOtp = '';
    user.verifyOtpExpireAt = 0;
    await user.save();

    return res.status(200).json({ success: true, message: 'Email Verified Successfully!' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

//  Check Authentication
export const isAuthenticated = async (req, res) => {
  try {
    return res.status(200).json({ success: true, user: req.user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//  Send Password Reset OTP
export const sendResetOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ success: false, message: 'Email is required!' });

  try {
    const user = await userModel.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.resetOtp = otp;
    user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000;
    await user.save();

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: 'Password Reset OTP',
      text: `Your OTP for resetting your password is ${otp}.`,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({ success: true, message: 'OTP sent to your email' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

//  Reset Password using OTP
export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res.status(400).json({ success: false, message: 'Email, OTP, and new password are required' });
  }

  try {
    const user = await userModel.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (!user.resetOtp || user.resetOtp !== otp)
      return res.status(400).json({ success: false, message: 'Invalid OTP' });

    if (user.resetOtpExpireAt < Date.now())
      return res.status(400).json({ success: false, message: 'OTP Expired' });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetOtp = '';
    user.resetOtpExpireAt = 0;

    await user.save();
    return res.status(200).json({ success: true, message: 'Password has been reset successfully!' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
