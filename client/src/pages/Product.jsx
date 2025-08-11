import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AppContext } from '../context/AppContext';
import Navbar from '../components/Navbar';

const Product = () => {
  const { backendUrl } = useContext(AppContext);
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
    <div className="min-h-screen bg-gray-100">
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
              </div>
            ))
          ) : (
            <p className="text-gray-600 col-span-full">No products found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Product;
