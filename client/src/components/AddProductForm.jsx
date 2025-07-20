import React, { useEffect, useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const AddProductForm = () => {
  const { backendUrl } = useContext(AppContext);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    image: null,
    category: ''
  });

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/categories`);
      setCategories(res.data);
    } catch (err) {
      toast.error('Failed to fetch categories');
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    for (let key in form) {
      data.append(key, form[key]);
    }

    try {
      const res = await axios.post(`${backendUrl}/api/products`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true
      });
      toast.success(res.data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Add failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white shadow rounded space-y-4 max-w-xl mx-auto">
      <h2 className="text-xl font-semibold">Add Product</h2>
      <input type="text" placeholder="Name" required className="input" onChange={e => setForm({...form, name: e.target.value})} />
      <textarea placeholder="Description" className="input" onChange={e => setForm({...form, description: e.target.value})} />
      <input type="number" placeholder="Price" required className="input" onChange={e => setForm({...form, price: e.target.value})} />
      <input type="file" required onChange={e => setForm({...form, image: e.target.files[0]})} />
      <select required onChange={e => setForm({...form, category: e.target.value})} className="input">
        <option value="">Select Category</option>
        {categories.map(cat => (
          <option value={cat._id} key={cat._id}>{cat.name}</option>
        ))}
      </select>
      <button className="bg-[#0e0a22] text-white px-4 py-2 rounded">Submit</button>
    </form>
  );
};

export default AddProductForm;
