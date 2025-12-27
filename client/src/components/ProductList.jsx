import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const ProductList = () => {
  const { backendUrl } = useContext(AppContext);
  const [products, setProducts] = useState([]);

  const loadProducts = async () => {
    try {
      // Admin sees all products (including hidden ones)
      const res = await axios.get(`${backendUrl}/api/products?showAll=true`);
      setProducts(res.data.products);
    } catch (err) {
      console.error("Fetch error", err);
    }
  };

  const toggleVisibility = async (productId, currentStatus) => {
    try {
      const res = await axios.patch(
        `${backendUrl}/api/products/${productId}/toggle-visibility`,
        {},
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        loadProducts(); // Reload products
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to toggle visibility');
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">All Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {products.map(prod => (
          <div key={prod._id} className={`border p-4 rounded shadow relative ${prod.isActive ? 'bg-white' : 'bg-gray-100 opacity-75'}`}>
            {/* Visibility Badge */}
            <div className="absolute top-2 right-2">
              <span className={`px-2 py-1 text-xs rounded-full font-semibold ${prod.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {prod.isActive ? '👁️ Visible' : '🚫 Hidden'}
              </span>
            </div>

            <img src={prod.image} alt={prod.name} className="h-40 object-cover mb-2 w-full rounded" />
            <h3 className="font-bold">{prod.name}</h3>
            <p className="text-sm">{prod.description}</p>
            <p className="text-lg text-green-600">Rs. {prod.price}</p>
            <p className="text-xs italic text-gray-500">Category: {prod.category.name}</p>

            {/* Toggle Visibility Button */}
            <button
              onClick={() => toggleVisibility(prod._id, prod.isActive)}
              className={`mt-3 w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${prod.isActive
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-green-500 hover:bg-green-600 text-white'
                }`}
            >
              {prod.isActive ? (
                <>
                  <FaEyeSlash size={14} />
                  Hide from Customers
                </>
              ) : (
                <>
                  <FaEye size={14} />
                  Show to Customers
                </>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
