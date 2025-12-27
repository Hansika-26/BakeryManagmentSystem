import React, { useContext, useState } from 'react';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const LoginModal = ({ isOpen, onClose, onForgotPassword }) => {
  const navigate = useNavigate();
  const { backendUrl, setIsLoggedin, getUserData } = useContext(AppContext);
  const [state, setState] = useState('Login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  console.log('Backend URL:', backendUrl);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (state === 'Sign Up') {
      if (name.trim().length < 2) {
        toast.error("Name should be at least 2 characters");
        return;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        toast.error("Please enter a valid email address");
        return;
      }
      const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
      if (!passwordRegex.test(password)) {
        toast.error("Password must be at least 8 characters, include a letter, number and symbol");
        return;
      }
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        toast.error("Please enter a valid email address");
        return;
      }
      if (password.length === 0) {
        toast.error("Password cannot be empty");
        return;
      }
    }

    try {
      axios.defaults.withCredentials = true;
      console.log('Login data:', { email, password });

      if (state === 'Sign Up') {
        const { data } = await axios.post(backendUrl + '/api/auth/register', { name, email, password });
        console.log('Register response:', data);
        if (data.success) {
          toast.success("Registration successful! Please log in.");
          setState('Login');
          setName('');
          setEmail('');
          setPassword('');
        } else {
          toast.error(data.message || "Registration failed");
        }
      } else {
        const response = await axios.post(backendUrl + '/api/auth/login', { email, password });
        console.log('Login response:', response.data);
        if (response.data.msg === "User logged in") { // Check msg instead of success
          toast.success("Login successful!");
          await getUserData();
          setIsLoggedin(true);
          onClose(); // Close modal after successful login

          // Redirect based on user role
          const userRole = response.data.user?.role;
          if (userRole === "admin") {
            navigate("/admin/dashboard");
          } else {
            navigate("/user/dashboard");
          }
        } else {
          toast.error(response.data.msg || "Login failed");
        }
      }
    } catch (error) {
      console.error('Login error details:', error);
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || error.response?.data?.msg || "Operation failed";
        console.log("Extracted error message:", errorMessage);
        toast.error(errorMessage);
      } else {
        toast.error(error.message || "Something went wrong. Please try again.");
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl flex overflow-hidden relative transform transition-all duration-300 scale-100 hover:scale-[1.01]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/90 hover:bg-red-500 text-gray-600 hover:text-white transition-all duration-300 flex items-center justify-center shadow-lg group"
        >
          <span className="text-xl group-hover:rotate-90 transition-transform duration-300">✕</span>
        </button>

        {/* Left Side - Bakery Image */}
        <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-amber-100 via-orange-50 to-amber-50 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-orange-400/20"></div>
          <img
            src={assets.Bakery}
            alt="Bakery"
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
            <h3 className="text-3xl font-bold mb-2 drop-shadow-lg">🥐 Fresh Baked Daily</h3>
            <p className="text-lg opacity-90 drop-shadow">Join our bakery family and enjoy artisanal treats</p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white">
          <div className="max-w-md mx-auto w-full">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-block p-3 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full mb-4 shadow-lg">
                <img src={assets.LogoImage} alt="BakeMate Logo" className="w-12 h-12 rounded-full object-cover" />
              </div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-2">
                {state === 'Sign Up' ? 'Create Account' : 'Welcome Back!'}
              </h2>
              <p className="text-gray-500 text-sm">
                {state === 'Sign Up' ? '🍰 Join our bakery family today' : '🎂 Login to continue your sweet journey'}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={onSubmitHandler} className="space-y-6">
              {state === 'Sign Up' && (
                <div className="group">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <img src={assets.person_icon} alt="" className="w-5 h-5 opacity-50" />
                    </div>
                    <input
                      onChange={e => setName(e.target.value.trim())}
                      value={name}
                      className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl outline-none transition-all duration-300 focus:border-orange-500 focus:bg-white focus:shadow-lg group-hover:border-gray-300"
                      type="text"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                </div>
              )}

              <div className="group">
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <img src={assets.mail_icon} alt="" className="w-5 h-5 opacity-50" />
                  </div>
                  <input
                    onChange={e => setEmail(e.target.value.trim())}
                    value={email}
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl outline-none transition-all duration-300 focus:border-orange-500 focus:bg-white focus:shadow-lg group-hover:border-gray-300"
                    type="email"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              <div className="group">
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <img src={assets.lock_icon} alt="" className="w-5 h-5 opacity-50" />
                  </div>
                  <input
                    onChange={e => setPassword(e.target.value.trim())}
                    value={password}
                    className="w-full pl-12 pr-12 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl outline-none transition-all duration-300 focus:border-orange-500 focus:bg-white focus:shadow-lg group-hover:border-gray-300"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-orange-500 transition-colors duration-200"
                  >
                    {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                  </button>
                </div>
              </div>

              {state === 'Login' && (
                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      if (onForgotPassword) {
                        onForgotPassword();
                      } else {
                        navigate('/reset-password');
                      }
                    }}
                    className="text-sm text-orange-500 hover:text-orange-600 font-medium transition-colors duration-200"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 mt-6"
              >
                {state === 'Sign Up' ? '🎉 Create Account' : '🍪 Login Now'}
              </button>
            </form>
            {/* Toggle State */}
            <div className="mt-8 text-center">
              <p className="text-gray-500 text-xs">
                {state === 'Sign Up' ? (
                  <>
                    Already have an account?{' '}
                    <button
                      onClick={() => setState('Login')}
                      className="text-orange-500 font-semibold hover:text-orange-600 transition-colors duration-200 hover:underline"
                    >
                      Login here
                    </button>
                  </>
                ) : (
                  <>
                    Don't have an account?{' '}
                    <button
                      onClick={() => setState('Sign Up')}
                      className="text-orange-500 font-semibold hover:text-orange-600 transition-colors duration-200 hover:underline"
                    >
                      Sign Up
                    </button>
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;