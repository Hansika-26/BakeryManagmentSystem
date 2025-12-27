import React, { useContext, useRef, useState } from 'react';
import { assets } from '../assets/assets';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const ResetPasswordModal = ({ isOpen, onClose }) => {
  const { backendUrl } = useContext(AppContext);
  axios.defaults.withCredentials = true;

  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [isOtpSubmited, setIsOtpSubmited] = useState(false);

  const inputRefs = useRef([]);

  const handleClose = () => {
    onClose?.();
    setEmail('');
    setNewPassword('');
    setIsEmailSent(false);
    setOtp('');
    setIsOtpSubmited(false);
  };

  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData('text');
    const pasteArray = paste.split('');
    pasteArray.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
      }
    });
  };

  const onSubmitEmail = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(backendUrl + '/api/auth/send-reset-otp', { email });
      data.success ? toast.success(data.message) : toast.error(data.message);
      if (data.success) setIsEmailSent(true);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const onSubmitOtp = (e) => {
    e.preventDefault();
    const otpArray = inputRefs.current.map((e) => e.value);
    setOtp(otpArray.join(''));
    setIsOtpSubmited(true);
  };

  const onSubmitNewPassword = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(backendUrl + '/api/auth/reset-password', {
        email,
        otp,
        newPassword,
      });
      data.success ? toast.success(data.message) : toast.error(data.message);
      if (data.success) handleClose();
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center" onClick={handleClose}>
      <div
        className="bg-white border border-gray-200 p-8 rounded-lg shadow-2xl w-96 text-gray-700 text-sm relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={handleClose} className="absolute top-2 right-3 text-gray-600 hover:text-gray-800 text-xl" aria-label="Close reset password modal">&times;</button>

        {/* Step 1: Enter Email */}
        {!isEmailSent && (
          <form onSubmit={onSubmitEmail}>
            <h1 className="text-gray-800 text-2xl font-semibold text-center mb-4">Reset Password</h1>
            <p className="text-center mb-6 text-gray-600">Enter your registered email address</p>
            <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-gray-100 border border-gray-300">
              <img src={assets.mail_icon} alt="" className="w-5 h-3" />
              <input
                type="email"
                placeholder="Email id"
                className="bg-transparent outline-none text-gray-800 placeholder-gray-500 w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value.trim())}
                required
              />
            </div>
            <button className="w-full py-2.5 bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-600 hover:to-gray-800 text-white rounded-full mt-3 transition-all duration-200">
              Submit
            </button>
          </form>
        )}

        {/* Step 2: OTP */}
        {isEmailSent && !isOtpSubmited && (
          <form onSubmit={onSubmitOtp}>
            <h1 className="text-gray-800 text-2xl font-semibold text-center mb-4">Reset Password OTP</h1>
            <p className="text-center mb-6 text-gray-600">Enter the 6-digit code sent to your email id.</p>
            <div className="flex justify-between mb-8" onPaste={handlePaste}>
              {Array(6)
                .fill(0)
                .map((_, index) => (
                  <input
                    type="text"
                    key={index}
                    maxLength="1"
                    required
                    ref={(el) => (inputRefs.current[index] = el)}
                    className="w-10 h-10 bg-gray-100 border border-gray-300 text-gray-800 text-center text-xl rounded-md"
                    onInput={(e) => handleInput(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                  />
                ))}
            </div>
            <button className="w-full py-2.5 bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-600 hover:to-gray-800 text-white rounded-full mt-3 transition-all duration-200">
              Submit
            </button>
          </form>
        )}

        {/* Step 3: New Password */}
        {isEmailSent && isOtpSubmited && (
          <form onSubmit={onSubmitNewPassword}>
            <h1 className="text-gray-800 text-2xl font-semibold text-center mb-4">New Password</h1>
            <p className="text-center mb-6 text-gray-600">Enter your new password below</p>
            <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-gray-100 border border-gray-300">
              <img src={assets.lock_icon} alt="" className="w-5 h-3" />
              <input
                type="password"
                placeholder="Password"
                className="bg-transparent outline-none text-gray-800 placeholder-gray-500 w-full"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <button className="w-full py-2.5 bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-600 hover:to-gray-800 text-white rounded-full mt-3 transition-all duration-200">
              Submit
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordModal;
