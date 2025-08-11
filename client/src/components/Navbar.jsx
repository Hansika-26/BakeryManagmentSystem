import React, { useContext, useState } from 'react';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import LoginModal from './LoginModal';
import ResetPasswordModal from './ResetPasswordModal';


const Navbar = () => {
  const navigate = useNavigate();
  const { userData, backendUrl, setUserData, setIsLoggedin } = useContext(AppContext);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  const sendVerificationOtp = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(backendUrl + '/api/auth/send-verify-otp');
      if (data.success) {
        navigate('/email-verify');
        toast.success(data.message);
      } else {
        toast.error(data.message || "Failed to send verification OTP");
      }
    } catch (error) {
      toast.error(error.message || "Failed to send verification OTP");
    }
  };

  const Logout = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(backendUrl + '/api/auth/logout');
      if (data.success) {
        setIsLoggedin(false);
        setUserData(null);
        navigate('/');
        toast.success("Logged out successfully");
      } else {
        toast.error(data.message || "Logout failed");
      }
    } catch (error) {
      toast.error(error.message || "Logout failed");
    }
  };

  return (
    <div className="w-full flex justify-between items-center p-3 sm:p-4 sm:px-16 absolute top-0 z-50 bg-white">
      {/* Left - Logo */}
      <img
        src={assets.LogoImage}
        alt="Logo"
        className="w-20 sm:w-24 cursor-pointer"
        onClick={() => navigate('/')}
      />

      {/* Center - Navigation Links */}
      <div className="hidden sm:flex gap-6 text-gray-800 font-medium text-lg">
        <button onClick={() => navigate('/')} className="hover:text-green-600">Home</button>
        <button onClick={() => navigate('/Product')} className="hover:text-green-600">Products</button>
        <button onClick={() => navigate('/orders')} className="hover:text-green-600">Orders</button>
        <button onClick={() => navigate('/contact')} className="hover:text-green-600">Contact</button>
        <button onClick={() => navigate('/about')} className="hover:text-green-600">About</button>
      </div>

      {/* Right - Login/Profile */}
      {userData ? (
        <div className="w-8 h-8 flex justify-center items-center rounded-full bg-black text-white relative group cursor-pointer">
          {userData?.name ? userData.name[0].toUpperCase() : "?"}
          <div className="absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded pt-10">
            <ul className="list-none m-0 p-2 bg-gray-100 text-sm shadow-lg">
              
              {!userData.isAccountVerified && (
                <li
                  onClick={sendVerificationOtp}
                  className="py-1 px-2 hover:bg-gray-200 cursor-pointer"
                >
                  Verify email
                </li>
              )}
              <li
                onClick={Logout}
                className="py-1 px-2 hover:bg-gray-200 cursor-pointer"
              >
                Logout
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsLoginModalOpen(true)}
          className="flex items-center gap-2 border border-gray-500 rounded-full px-6 py-2 text-gray-800 hover:bg-gray-100 transition-all"
        >
          Login <img src={assets.arrow_icon} alt="" />
        </button>
      )}

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onForgotPassword={() => {
          setIsLoginModalOpen(false);
          setIsResetModalOpen(true);
        }}
      />

      <ResetPasswordModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
      />
    </div>
  );
};

export default Navbar;
