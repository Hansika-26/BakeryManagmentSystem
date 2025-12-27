import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Hero2 from '../assets/Hero2.jpg';
import { AppContext } from '../context/AppContext';
import { CartContext } from '../context/CartContext';
import LoginModal from '../components/LoginModal';
import axios from 'axios';
import { toast } from 'react-toastify';


const Home = () => {
  const navigate = useNavigate();
  const { backendUrl, isLoggedin, userData } = useContext(AppContext);
  const { addToCart } = useContext(CartContext);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Redirect logged-in users to their respective dashboards
  useEffect(() => {
    if (isLoggedin && userData?.role === 'admin') {
      navigate('/admin/dashboard', { replace: true });
    } else if (isLoggedin && userData?.role === 'user') {
      navigate('/user/dashboard', { replace: true });
    }
  }, [isLoggedin, userData, navigate]);

  const handleAddToCart = (product) => {
    if (!isLoggedin) {
      toast.info('Please login to add items to cart');
      setShowLoginModal(true);
      return;
    }
    addToCart(product);
  };


  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/categories`);
        setCategories(res.data);
      } catch (err) {
        console.error('Failed to load categories');
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
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
    loadProducts();
  }, [selectedCategory]);

  return (
    <>
      <Navbar />

      {/* Hero Section with Background */}
      <div
        className="w-full h-[80vh] mt-[50px] flex flex-col items-center justify-center bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${Hero2})` }}
      >
        <h1 className='text-white text-4xl font-bold'>Welcome to Our Bakery</h1>
        <p className='text-white mt-4'>Freshly baked happiness every day</p>
      </div>

      {/* Products Section */}
      <div className="p-6">
        <h1 className='text-3xl font-bold mt-10 text-center mb-6'>Products</h1>

        {/* 🔢 Category Filter */}
        <div className="flex flex-wrap gap-2 justify-center mb-6">
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

        {/* 🧁 Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {products.map(prod => (
            <div key={prod._id} className="border p-4 rounded-xl shadow bg-white aspect-square flex flex-col">
              <img src={prod.image} alt={prod.name} className="w-full h-40 object-cover rounded mb-2" />
              <h3 className="font-bold text-lg truncate">{prod.name}</h3>
              <p className="text-sm text-gray-500 flex-1">{prod.description}</p>
              <p className="text-green-600 font-semibold mt-1">Rs. {prod.price}</p>
              <p className="text-xs text-gray-400">Category: {prod.category.name}</p>
              <button
                onClick={() => handleAddToCart(prod)}
                className="mt-3 w-full bg-amber-600 text-white py-2 rounded-lg font-semibold hover:bg-amber-700 transition-colors flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Login Modal */}
      {showLoginModal && (
        <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
      )}
    </>
  );
};


export default Home;
