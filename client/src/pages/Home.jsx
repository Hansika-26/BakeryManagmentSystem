import React, { useEffect, useState, useContext } from 'react';
import Navbar from '../components/Navbar';
import Hero2 from '../assets/Hero2.jpg';
import { AppContext } from '../context/AppContext';
import axios from 'axios';


const Home = () => {
  
  const { backendUrl } = useContext(AppContext);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
 

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
            </div>
          ))}
        </div>
      </div>
    </>
  );
};


export default Home;
