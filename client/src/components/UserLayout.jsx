// 🍩 Shared User Layout with Sidebar
import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { CartContext } from '../context/CartContext';
import { assets } from '../assets/assets';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { FaShoppingCart, FaBox, FaUser, FaSignOutAlt, FaBars, FaInfoCircle, FaEnvelope } from 'react-icons/fa';
import { HiViewGrid } from 'react-icons/hi';

const UserLayout = ({ children, title }) => {
    const { backendUrl, setIsLoggedin, setUserData, userData } = useContext(AppContext);
    const { cartCount } = useContext(CartContext);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = async () => {
        try {
            const { data } = await axios.post(`${backendUrl}/api/auth/logout`, {}, { withCredentials: true });
            if (data.success) {
                setIsLoggedin(false);
                setUserData(null);
                toast.success("Logged out successfully");
                navigate('/');
            }
        } catch (error) {
            toast.error("Logout failed");
        }
    };

    // Check if current path matches
    const isActive = (path) => location.pathname === path;

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
            {/* 🌟 Modern Top Navbar */}
            <nav className="bg-white/80 backdrop-blur-md shadow-sm px-4 md:px-6 py-3 flex justify-between items-center sticky top-0 z-40 border-b border-amber-100">
                <div className="flex items-center gap-4">
                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                        className="md:hidden p-2 rounded-lg hover:bg-amber-100 text-gray-600 transition-colors"
                    >
                        <FaBars size={20} />
                    </button>

                    {/* Logo */}
                    <div
                        className="flex items-center gap-3 cursor-pointer group"
                        onClick={() => navigate('/user/dashboard')}
                    >
                        <img
                            src={assets.LogoImage}
                            alt="Bakery Logo"
                            className="h-12 w-12 md:h-14 md:w-14 rounded-full shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-105"
                        />
                    </div>
                </div>

                {/* Page Title - Center */}
                {title && (
                    <h1 className="hidden md:block text-xl font-bold text-amber-900">{title}</h1>
                )}

                {/* Right Side Actions */}
                <div className="flex items-center gap-2 md:gap-4">
                    {/* Cart Button */}
                    <button
                        onClick={() => navigate('/cart')}
                        className="relative p-2.5 rounded-full hover:bg-amber-100 text-gray-600 hover:text-amber-600 transition-all group"
                    >
                        <FaShoppingCart size={20} />
                        {cartCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold shadow-md animate-pulse">
                                {cartCount > 9 ? '9+' : cartCount}
                            </span>
                        )}
                    </button>

                    {/* User Profile Dropdown */}
                    <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
                        <div className="hidden md:block text-right">
                            <p className="text-sm font-medium text-gray-700">{userData?.name || 'User'}</p>
                            <p className="text-xs text-gray-500">Welcome back!</p>
                        </div>
                        <button
                            onClick={() => navigate('/profile')}
                            className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold shadow-md hover:shadow-lg hover:scale-105 transition-all"
                        >
                            {userData?.name ? userData.name[0].toUpperCase() : 'U'}
                        </button>
                    </div>
                </div>
            </nav>

            <div className="flex">
                {/* 📂 Modern Sidebar */}
                <aside className={`${sidebarCollapsed ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed md:static inset-y-0 left-0 z-30 w-64 bg-gradient-to-b from-[#5D4037] to-[#4E342E] text-white min-h-[calc(100vh-65px)] flex flex-col transition-all duration-300 shadow-xl md:shadow-none`}>

                    {/* User Card */}
                    <div className="p-5 m-4 bg-white/10 backdrop-blur rounded-2xl border border-white/20">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center font-bold text-xl text-white shadow-lg">
                                {userData?.name ? userData.name[0].toUpperCase() : '👤'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h2 className="text-white font-semibold truncate">{userData?.name || 'User'}</h2>
                                <p className="text-amber-200/80 text-xs truncate">{userData?.email || 'user@email.com'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 pb-4">
                        <div className="space-y-1">
                            {/* Products */}
                            <button
                                onClick={() => navigate('/user/dashboard')}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive('/user/dashboard')
                                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/30'
                                        : 'text-amber-100 hover:bg-white/10 hover:text-white'
                                    }`}
                            >
                                <HiViewGrid size={20} />
                                <span className="font-medium">Browse Products</span>
                            </button>

                            {/* Cart */}
                            <button
                                onClick={() => navigate('/cart')}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${isActive('/cart')
                                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/30'
                                        : 'text-amber-100 hover:bg-white/10 hover:text-white'
                                    }`}
                            >
                                <FaShoppingCart size={18} className="group-hover:scale-110 transition-transform" />
                                <span className="font-medium">My Cart</span>
                                {cartCount > 0 && (
                                    <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                                        {cartCount}
                                    </span>
                                )}
                            </button>

                            {/* Orders */}
                            <button
                                onClick={() => navigate('/orders')}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${isActive('/orders')
                                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/30'
                                        : 'text-amber-100 hover:bg-white/10 hover:text-white'
                                    }`}
                            >
                                <FaBox size={18} className="group-hover:scale-110 transition-transform" />
                                <span className="font-medium">My Orders</span>
                            </button>

                            {/* Profile */}
                            <button
                                onClick={() => navigate('/profile')}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${isActive('/profile')
                                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/30'
                                        : 'text-amber-100 hover:bg-white/10 hover:text-white'
                                    }`}
                            >
                                <FaUser size={18} className="group-hover:scale-110 transition-transform" />
                                <span className="font-medium">My Profile</span>
                            </button>
                        </div>

                        {/* Info Section */}
                        <div className="mt-4 pt-4 border-t border-white/10">
                            <p className="px-4 text-xs text-amber-200/50 uppercase tracking-wider mb-2">Information</p>

                            {/* About */}
                            <button
                                onClick={() => navigate('/user/about')}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${isActive('/user/about')
                                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/30'
                                        : 'text-amber-100 hover:bg-white/10 hover:text-white'
                                    }`}
                            >
                                <FaInfoCircle size={18} className="group-hover:scale-110 transition-transform" />
                                <span className="font-medium">About Us</span>
                            </button>

                            {/* Contact */}
                            <button
                                onClick={() => navigate('/user/contact')}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${isActive('/user/contact')
                                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/30'
                                        : 'text-amber-100 hover:bg-white/10 hover:text-white'
                                    }`}
                            >
                                <FaEnvelope size={18} className="group-hover:scale-110 transition-transform" />
                                <span className="font-medium">Contact Us</span>
                            </button>
                        </div>

                        {/* Divider */}
                        <div className="my-6 border-t border-white/10"></div>

                        {/* Logout */}
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-300 hover:bg-red-500/20 hover:text-red-200 transition-all group"
                        >
                            <FaSignOutAlt size={18} className="group-hover:scale-110 transition-transform" />
                            <span className="font-medium">Logout</span>
                        </button>
                    </nav>

                    {/* Footer */}
                    <div className="p-4 border-t border-white/10">
                        <div className="text-center">
                            <p className="text-amber-200/60 text-xs">© 2025 BakeMate</p>
                            <p className="text-amber-200/40 text-xs">Fresh Baked with Love</p>
                        </div>
                    </div>
                </aside>

                {/* Overlay for mobile */}
                {sidebarCollapsed && (
                    <div
                        className="md:hidden fixed inset-0 bg-black/50 z-20"
                        onClick={() => setSidebarCollapsed(false)}
                    />
                )}

                {/* Main Content */}
                <main className="flex-1 p-4 md:p-6 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default UserLayout;
