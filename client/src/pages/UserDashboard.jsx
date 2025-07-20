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
        <aside className="w-64 bg-[#0d0b26] text-white h-[calc(100vh-64px)] p-6 sticky top-16">
          <h2 className="text-xl font-bold mb-4">User Panel</h2>
          <nav className="flex flex-col gap-4 text-medium font-medium">
            <button onClick={() => navigate('')} className="text-left hover:bg-green-600 p-2 rounded"> View Products</button>
            <button onClick={() => navigate('/')} className="text-left hover:bg-green-600 p-2 rounded"> Home</button>
            <button onClick={() => navigate('')} className="text-left hover:bg-green-600 p-2 rounded"> Orders</button>
            <button onClick={() => navigate('/profile')} className="text-left hover:bg-green-600 p-2 rounded">My Profile</button>
          </nav>
        </aside>

        {/* 🣑 Product Grid */}
        <main className="flex-1 bg-gray-100 p-6">
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