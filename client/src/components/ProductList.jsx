import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AppContext } from '../context/AppContext';

const ProductList = () => {
  const { backendUrl } = useContext(AppContext);
  const [products, setProducts] = useState([]);

  const loadProducts = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/products`);
      setProducts(res.data.products);
    } catch (err) {
      console.error("Fetch error", err);
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
          <div key={prod._id} className="border p-4 rounded shadow bg-white">
            <img src={prod.image} alt={prod.name} className="h-40 object-cover mb-2 w-full" />
            <h3 className="font-bold">{prod.name}</h3>
            <p className="text-sm">{prod.description}</p>
            <p className="text-lg text-green-600">Rs. {prod.price}</p>
            <p className="text-xs italic text-gray-500">Category: {prod.category.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
