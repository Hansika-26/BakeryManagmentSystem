import React, { useContext, useState } from 'react';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';


const LoginModal = ({ isOpen, onClose, onForgotPassword }) => {
  const navigate = useNavigate();
  const { backendUrl, setIsLoggedin, getUserData } = useContext(AppContext);
  const [state, setState] = useState('Sign Up');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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
          setIsLoggedin(true); // This triggers Navbar re-render if it depends on isLoggedin

          onClose(); // Close modal after successful login and data fetch

          // Small delay to allow state to propagate before routing if needed, 
          // though React state updates are batched.
          setTimeout(() => {
            // Force check if needed or just navigate
            // Navbar should check 'userData' or 'isLoggedin'

            switch (response.data.user.role) {
              case "admin":
                navigate("/admin/dashboard");
                // Remove window.location.reload() to let SPA handle state
                break;
              case "user":
                navigate("/");
                // Remove window.location.reload() to let SPA handle state
                break;
              default:
                navigate("/");
            }
          }, 100);
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white border border-gray-200 p-10 rounded-lg shadow-2xl w-full sm:w-96 text-gray-700 text-sm relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-white"
        >
          ✕
        </button>
        <h2 className="text-3xl font-semibold text-white text-center mb-3">
          {state === 'Sign Up' ? 'Create account' : 'Login'}
        </h2>
        <p className="text-center text-sm mb-6 text-gray-600">
          {state === 'Sign Up' ? 'Create your account' : 'Login to your account!'}
        </p>

        <form onSubmit={onSubmitHandler}>
          {state === 'Sign Up' && (
            <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-gray-100 border border-gray-300">
              <img src={assets.person_icon} alt="" />
              <input
                onChange={e => setName(e.target.value.trim())}
                value={name}
                className="bg-transparent outline-none text-gray-800 placeholder-gray-500"
                type="text"
                placeholder="Full Name"
                required
              />
            </div>
          )}
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-gray-100 border border-gray-300">
            <img src={assets.mail_icon} alt="" />
            <input
              onChange={e => setEmail(e.target.value.trim())}
              value={email}
              className="bg-transparent text-gray-800 outline-none placeholder-gray-500"
              type="email"
              placeholder="Email id"
              required
            />
          </div>
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-gray-100 border border-gray-300">
            <img src={assets.lock_icon} alt="" />
            <input
              onChange={e => setPassword(e.target.value.trim())}
              value={password}
              className="bg-transparent text-gray-800 outline-none placeholder-gray-500"
              type="password"
              placeholder="Password"
              required
            />
          </div>
          <p
            onClick={() => {
              onClose();
              if (onForgotPassword) {
                onForgotPassword();
              } else {
                navigate('/reset-password');
              }
            }}
            className="mb-4 text-blue-400 cursor-pointer hover:text-blue-300"
          >
            Forgot password
          </p>
          <button className="w-full py-2.5 bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-600 hover:to-gray-800 text-white rounded-full mt-3 transition-all duration-200">
            {state}
          </button>
        </form>
        {state === 'Sign Up' ? (
          <p className="text-gray-600 text-center text-xs mt-4">
            Already have an account?{' '}
            <span onClick={() => setState('Login')} className="text-blue-400 cursor-pointer underline hover:text-blue-300">
              Login here
            </span>
          </p>
        ) : (
          <p className="text-gray-600 text-center text-xs mt-4">
            Don’t have an account?{' '}
            <span onClick={() => setState('Sign Up')} className="text-blue-400 cursor-pointer underline hover:text-blue-300">
              Sign Up
            </span>
          </p>
        )}
      </div>
    </div>
  );
};

export default LoginModal;