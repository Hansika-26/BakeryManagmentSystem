// 🍩 User Dashboard with Top & Side Navbars for Bakery
import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AppContext } from '../context/AppContext';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';

const UserDashboard = () => {
  const { backendUrl } = useContext(AppContext);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const navigate = useNavigate();

  const loadProducts = async () => {
    try {
      const url = selectedCategory
        ? `${backendUrl}/api/products?category=${selectedCategory}`
        : `${backendUrl}/api/products`;
      const res = await axios.get(url);
      setProducts(res.data.products);
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

  return (
    <div className="min-h-screen">
      {/* 🌟 Top Navbar */}
      <nav className="bg-white shadow p-4 flex justify-between items-center sticky top-0 z-30 w-full">
        <div className="flex items-center space-x-3">
          <img src={assets.LogoImage} alt="Bakery Logo" className="h-10" />
          <h1 className="text-2xl font-bold text-gray-800">Bakery User Dashboard</h1>
        </div>
        <div className="space-x-6 font-medium text-gray-700 text-sm">
          <button onClick={() => navigate('/')} className="hover:text-green-600">Home</button>
          <button onClick={() => navigate('/orders')} className="hover:text-green-600">Orders</button>
          <button onClick={() => navigate('/FAQ')} className="hover:text-green-600">FAQ</button>
          <button onClick={() => navigate('/contact')} className="hover:text-green-600">Contact</button>
          <button onClick={() => navigate('/about')} className="hover:text-green-600">About</button>
          <button onClick={() => navigate('/login')} className="hover:text-green-600 bg-gray-300 p-2 rounded w-38 h-9">LogOut</button>
        </div>
      </nav>

      <div className="flex">
        {/* 📂 Side Navbar */}
        {/* 📂 Side Navbar (Redesigned) */}
        <aside className="w-64 bg-[#5D4037] border-r border-[#795548] text-white min-h-[calc(100vh-64px)] p-4 flex flex-col sticky top-16 transition-all duration-300">

          <div className="mb-6 flex items-center gap-3 pb-4 border-b border-[#795548]">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-600 to-amber-700 flex items-center justify-center font-bold text-sm text-white shadow-lg border border-amber-200">
              U
            </div>
            <h2 className="text-lg font-bold tracking-wide">User Panel</h2>
          </div>

          <nav className="flex flex-col gap-2 flex-1">
            <button onClick={() => navigate('')} className="group flex items-center gap-3 p-3 rounded-xl text-amber-50 hover:bg-[#4E342E] hover:text-white transition-all duration-200 text-left">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:scale-105" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
              View Products
            </button>
            <button onClick={() => navigate('/orders')} className="group flex items-center gap-3 p-3 rounded-xl text-amber-50 hover:bg-[#4E342E] hover:text-white transition-all duration-200 text-left">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:scale-105" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
              My Orders
            </button>
            <button onClick={() => navigate('/profile')} className="group flex items-center gap-3 p-3 rounded-xl text-amber-50 hover:bg-[#4E342E] hover:text-white transition-all duration-200 text-left">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:scale-105" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              My Profile
            </button>
          </nav>

          <div className="mt-auto border-t border-[#795548] pt-4">
            <button onClick={() => navigate('/')} className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-[#4E342E] text-amber-50 hover:bg-[#3E2723] hover:text-white transition-all duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
              Home Page
            </button>
          </div>
        </aside>

        {/* 🣑 Product Grid */}
        <main className="flex-1 bg-amber-50 p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800"> Products</h2>

          {/* 🔢 Category Filter at Top */}
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setSelectedCategory('')}
              className={`px-3 py-1 rounded-full border text-sm ${selectedCategory === '' ? 'bg-green-700 text-white' : 'bg-white text-gray-700 border-gray-300'}`}
            >
              All Categories
            </button>
            {categories.map(cat => (
              <button
                key={cat._id}
                onClick={() => setSelectedCategory(cat._id)}
                className={`px-3 py-1 rounded-full border text-sm ${selectedCategory === cat._id ? 'bg-green-700 text-white' : 'bg-white text-gray-700 border-gray-300'}`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {products.map(prod => (
              <div key={prod._id} className="border p-4 rounded-xl shadow bg-white aspect-square flex flex-col">
                <img src={prod.image} alt={prod.name} className="w-full h-40 object-cover rounded mb-2" />
                <h3 className="font-bold text-lg truncate">{prod.name}</h3>
                <p className="text-sm text-gray-500 flex-1">{prod.description}</p>
                <p className="text-green-600 font-semibold mt-1">Rs. {prod.price}</p>
                <p className="text-xs text-gray-400">Category: {prod.category.name}</p>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserDashboard;