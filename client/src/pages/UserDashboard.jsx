// 🍩 User Dashboard with Top & Side Navbars for Bakery
import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AppContext } from '../context/AppContext';
import { CartContext } from '../context/CartContext';
import { assets } from '../assets/assets';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaShoppingCart, FaBox, FaUser, FaSignOutAlt, FaSearch, FaTimes, FaBars, FaInfoCircle, FaEnvelope } from 'react-icons/fa';
import { HiViewGrid } from 'react-icons/hi';

const UserDashboard = () => {
  const { backendUrl, setIsLoggedin, setUserData, userData } = useContext(AppContext);
  const { addToCart, cartCount } = useContext(CartContext);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
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

  const loadProducts = async () => {
    try {
      const url = selectedCategory
        ? `${backendUrl}/api/products?category=${selectedCategory}`
        : `${backendUrl}/api/products`;
      const res = await axios.get(url);
      setProducts(res.data.products);
      setFilteredProducts(res.data.products);
    } catch (err) {
      console.error('Failed to load products');
    }
  };

  const loadCategories = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/categories`);
      setCategories(res.data);
    } catch (err) {
      console.error('Failed to load categories');
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadProducts();
  }, [selectedCategory]);

  // Filter products based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(prod =>
        prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prod.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [searchQuery, products]);

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

        {/* Search Bar - Desktop */}
        <div className="hidden md:flex flex-1 max-w-xl mx-8">
          <div className="relative w-full">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search for delicious treats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-full focus:ring-2 focus:ring-amber-400 focus:border-amber-400 focus:bg-white outline-none transition-all text-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FaTimes size={14} />
              </button>
            )}
          </div>
        </div>

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
              {/* Products - Active */}
              <button
                onClick={() => navigate('/user/dashboard')}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/30 transition-all"
              >
                <HiViewGrid size={20} />
                <span className="font-medium">Browse Products</span>
              </button>

              {/* Cart */}
              <button
                onClick={() => navigate('/cart')}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-amber-100 hover:bg-white/10 hover:text-white transition-all group"
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
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-amber-100 hover:bg-white/10 hover:text-white transition-all group"
              >
                <FaBox size={18} className="group-hover:scale-110 transition-transform" />
                <span className="font-medium">My Orders</span>
              </button>

              {/* Profile */}
              <button
                onClick={() => navigate('/profile')}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-amber-100 hover:bg-white/10 hover:text-white transition-all group"
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
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-amber-100 hover:bg-white/10 hover:text-white transition-all group"
              >
                <FaInfoCircle size={18} className="group-hover:scale-110 transition-transform" />
                <span className="font-medium">About Us</span>
              </button>

              {/* Contact */}
              <button
                onClick={() => navigate('/user/contact')}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-amber-100 hover:bg-white/10 hover:text-white transition-all group"
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

        {/* 🧁 Main Content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          {/* Mobile Search */}
          <div className="md:hidden mb-4">
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-10 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none transition-all shadow-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <FaTimes size={14} />
                </button>
              )}
            </div>
          </div>

          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">🧁 Our Delicious Menu</h1>
            <p className="text-gray-500 mt-1">Freshly baked goods, made with love</p>
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setSelectedCategory('')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${selectedCategory === ''
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md shadow-amber-200'
                  : 'bg-white text-gray-600 hover:bg-amber-50 hover:text-amber-600 border border-gray-200'
                }`}
            >
              ✨ All Items
            </button>
            {categories.map(cat => (
              <button
                key={cat._id}
                onClick={() => setSelectedCategory(cat._id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${selectedCategory === cat._id
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md shadow-amber-200'
                    : 'bg-white text-gray-600 hover:bg-amber-50 hover:text-amber-600 border border-gray-200'
                  }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-gray-500 text-lg font-medium">No products found</p>
              <p className="text-gray-400 text-sm mt-1">Try adjusting your search or filter</p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedCategory(''); }}
                className="mt-4 px-6 py-2 bg-amber-100 text-amber-600 rounded-full font-medium hover:bg-amber-200 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {filteredProducts.map(prod => (
                <div
                  key={prod._id}
                  className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100"
                >
                  {/* Product Image */}
                  <div className="relative overflow-hidden">
                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3">
                      <span className="px-3 py-1 bg-white/90 backdrop-blur text-xs font-medium text-amber-600 rounded-full shadow">
                        {prod.category?.name || 'Uncategorized'}
                      </span>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <h3 className="font-bold text-gray-800 text-lg truncate group-hover:text-amber-600 transition-colors">
                      {prod.name}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2 h-10">{prod.description}</p>

                    <div className="flex items-center justify-between mt-4">
                      <span className="text-xl font-bold text-amber-600">Rs. {prod.price}</span>
                      <button
                        onClick={() => addToCart(prod)}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full font-medium hover:shadow-lg hover:scale-105 transition-all duration-200"
                      >
                        <FaShoppingCart size={14} />
                        <span className="hidden sm:inline">Add</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default UserDashboard;