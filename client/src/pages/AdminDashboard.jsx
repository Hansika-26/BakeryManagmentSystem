// 🍰 Creative Admin Dashboard for Bakery Management - Product CRUD
import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import { assets } from '../assets/assets';
import AdminSidebar from '../components/AdminSidebar';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const { backendUrl } = useContext(AppContext);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', price: '', category: '', image: null });
  const [active, setActive] = useState('view');
  const navigate = useNavigate();

  const loadProducts = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/products`);
      setProducts(res.data.products);
    } catch (err) {
      toast.error('Failed to load products');
    }
  };

  const loadCategories = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/categories`);
      setCategories(res.data);
    } catch (err) {
      toast.error('Failed to load categories');
    }
  };

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  const deleteProduct = async (id) => {
    try {
      await axios.delete(`${backendUrl}/api/products/${id}`, { withCredentials: true });
      toast.success('Deleted');
      loadProducts();
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  const handleEdit = (product) => {
    setActive('edit');
    setEditingId(product._id);
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category._id,
      image: null
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      for (let key in form) {
        if (form[key] !== null && form[key] !== '') {
          formData.append(key, form[key]);
        }
      }

      const res = await axios.patch(`${backendUrl}/api/products/${editingId}`, formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.success) {
        toast.success('Updated');
        setEditingId(null);
        setForm({ name: '', description: '', price: '', category: '', image: null });
        setActive('view');
        loadProducts();
      } else {
        toast.error(res.data.message || 'Update failed');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      for (let key in form) {
        if (form[key]) formData.append(key, form[key]);
      }

      const res = await axios.post(`${backendUrl}/api/products`, formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.success) {
        toast.success('Product added');
        setForm({ name: '', description: '', price: '', category: '', image: null });
        loadProducts();
      } else {
        toast.error(res.data.message || 'Add failed');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Add failed');
    }
  };

  return (
    <div className="min-h-screen">
      {/* 🌟 Navbar */}
      <nav className="bg-white shadow p-4 flex justify-between items-center sticky top-0 z-30 w-full">
             <div className="flex items-center space-x-3">
               <img src={assets.LogoImage} alt="Bakery Logo" className="h-10" />
               <h1 className="text-2xl font-bold text-gray-800">Bakery Admin Dashboard</h1>
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
        <AdminSidebar setActive={setActive} />
        <div className="flex-1 bg-gray-200 p-6">
          {active === 'add' && (
            <main className="flex-1 bg-gray-200 p-8 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow mb-6">
              <h2 className="text-xl font-semibold mb-4"> Add New Product</h2>
              <form onSubmit={handleAdd} className="grid grid-cols-2 gap-4">
                <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="rounded-xl border p-3" placeholder="Product Name" required />
                <input type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} className="rounded-xl border p-3" placeholder="Price (Rs)" required />
                <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="rounded-xl border p-3" required>
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
                <input type="file" onChange={e => setForm({ ...form, image: e.target.files[0] })} className="rounded-xl border p-3" required />
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="col-span-2 rounded-xl border p-3" placeholder="Description" rows={3} />
                <button type="submit" className="col-span-2 bg-green-600 text-white py-2 rounded-xl font-semibold hover:bg-green-700">Add Product</button>
              </form>
            </div>
            </main>
          )}

          {(active === 'view' || active === 'edit') && (
            <>
              <h2 className="text-xl font-semibold mb-4 text-gray-800"> Manage Products</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {products.map(prod => (
                  <div key={prod._id} className="border p-4 rounded-xl shadow bg-white aspect-square flex flex-col">
                    {editingId === prod._id ? (
                      <form onSubmit={handleUpdate} className="flex flex-col space-y-2 flex-1">
                        <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="rounded-lg border p-2" required />
                        <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="rounded-lg border p-2" />
                        <input type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} className="rounded-lg border p-2" required />
                        <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="rounded-lg border p-2" required>
                          <option value="">Select Category</option>
                          {categories.map(cat => (
                            <option key={cat._id} value={cat._id}>{cat.name}</option>
                          ))}
                        </select>
                        <input type="file" onChange={e => setForm({ ...form, image: e.target.files[0] })} className="rounded-lg border p-2" />
                        <div className="flex justify-between">
                          <button type="submit" className="bg-blue-600 text-white px-3 py-1 rounded">Save</button>
                          <button onClick={() => { setEditingId(null); setActive('view'); }} className="bg-gray-400 text-white px-3 py-1 rounded">Cancel</button>
                        </div>
                      </form>
                    ) : (
                      <div className="flex-1 flex flex-col">
                        <img src={prod.image} alt={prod.name} className="w-full h-40 object-cover rounded mb-2" />
                        <h3 className="font-bold text-lg truncate">{prod.name}</h3>
                        <p className="text-sm text-gray-500 flex-1">{prod.description}</p>
                        <p className="text-green-600 font-semibold mt-1">Rs. {prod.price}</p>
                        <p className="text-xs text-gray-400">Category: {prod.category.name}</p>
                        <div className="flex justify-between mt-2">
                          <button onClick={() => handleEdit(prod)} className="bg-yellow-500 text-white px-3 py-1 rounded">Edit</button>
                          <button onClick={() => deleteProduct(prod._id)} className="bg-red-600 text-white px-3 py-1 rounded">Delete</button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
