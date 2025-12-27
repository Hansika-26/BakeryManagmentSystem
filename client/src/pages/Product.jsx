import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AppContext } from '../context/AppContext';
import { CartContext } from '../context/CartContext';
import Navbar from '../components/Navbar';
import LoginModal from '../components/LoginModal';
import { toast } from 'react-toastify';

const Product = () => {
  const navigate = useNavigate();
  const { backendUrl, isLoggedin, userData } = useContext(AppContext);
  const { addToCart } = useContext(CartContext);
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
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

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

  useEffect(() => {
    const filtered = products.filter((prod) =>
      prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchQuery, products]);

  return (
    <div className="min-h-screen bg-amber-50">
      <Navbar />

      <div className="pt-24 px-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Our Products</h2>

        {/* 🧭 Category Dropdown & Search Row */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          {/* Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setSearchQuery('');
            }}
            className="border border-gray-800 px-4 py-2 rounded w-full sm:w-1/4"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>

          {/* Search Input */}
          <input
            type="text"
            placeholder="Search products..."
            className="border border-gray-900 px-4 py-2 rounded w-full sm:w-1/4"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((prod) => (
              <div
                key={prod._id}
                className="border p-4 rounded-xl shadow bg-white flex flex-col"
              >
                <img
                  src={prod.image}
                  alt={prod.name}
                  className="w-full h-40 object-cover rounded mb-2"
                />
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
            ))
          ) : (
            <p className="text-gray-600 col-span-full">No products found.</p>
          )}
        </div>
      </div>

      {/* Login Modal */}
      {showLoginModal && (
        <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
      )}
    </div>
  );
};

export default Product;
