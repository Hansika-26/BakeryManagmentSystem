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


  const closeEditModal = () => {
    setEditingId(null);
    setForm({ name: '', description: '', price: '', category: '', image: null });
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
        <div className="flex-1 bg-amber-50 p-6 min-h-[calc(100vh-72px)]">
          {active === 'add' ? (
            <main className="flex-1 bg-amber-50 p-8 flex items-center justify-center">
              <div className="bg-white p-6 rounded-lg shadow mb-6 border border-amber-100 max-w-2xl w-full">
                <h2 className="text-xl font-semibold mb-6 text-amber-900"> Add New Product</h2>
                <form onSubmit={handleAdd} className="grid grid-cols-2 gap-4">
                  <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="rounded-xl border border-gray-300 p-3 focus:ring-2 focus:ring-amber-500 focus:outline-none" placeholder="Product Name" required />
                  <input type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} className="rounded-xl border border-gray-300 p-3 focus:ring-2 focus:ring-amber-500 focus:outline-none" placeholder="Price (Rs)" required />
                  <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="rounded-xl border border-gray-300 p-3 focus:ring-2 focus:ring-amber-500 focus:outline-none" required>
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat._id} value={cat._id}>{cat.name}</option>
                    ))}
                  </select>
                  <label className="rounded-xl border border-gray-300 p-3 bg-white cursor-pointer hover:bg-gray-50 flex items-center justify-center text-gray-500">
                    <span className="truncate">{form.image ? form.image.name : 'Upload Image'}</span>
                    <input type="file" onChange={e => setForm({ ...form, image: e.target.files[0] })} className="hidden" required />
                  </label>
                  <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="col-span-2 rounded-xl border border-gray-300 p-3 focus:ring-2 focus:ring-amber-500 focus:outline-none" placeholder="Description" rows={4} />
                  <button type="submit" className="col-span-2 bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition shadow-md">Add Product</button>
                </form>
              </div>
            </main>
          ) : (
            <>
              <h2 className="text-2xl font-bold mb-6 text-amber-900 border-b border-amber-200 pb-2"> Manage Products</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map(prod => (
                  <div key={prod._id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden border border-amber-100 flex flex-col group">
                    <div className="relative h-48 overflow-hidden">
                      <img src={prod.image} alt={prod.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded-full text-xs font-bold text-amber-800 shadow-sm">
                        {prod.category?.name}
                      </div>
                    </div>

                    <div className="p-4 flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-lg text-gray-800 line-clamp-1">{prod.name}</h3>
                        <span className="text-green-700 font-bold whitespace-nowrap">Rs. {prod.price}</span>
                      </div>
                      <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-1">{prod.description}</p>

                      <div className="grid grid-cols-2 gap-3 mt-auto">
                        <button onClick={() => handleEdit(prod)} className="bg-amber-100 text-amber-900 py-2 rounded-lg font-medium hover:bg-amber-200 transition-colors">Edit</button>
                        <button onClick={() => deleteProduct(prod._id)} className="bg-red-50 text-red-600 py-2 rounded-lg font-medium hover:bg-red-100 transition-colors">Delete</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* 🛠️ Update Product Modal */}
      {editingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-scaleIn">
            <div className="bg-amber-50 px-6 py-4 border-b border-amber-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-amber-900">Update Product</h3>
              <button onClick={closeEditModal} className="text-gray-400 hover:text-gray-600 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <form onSubmit={handleUpdate} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full rounded-lg border border-gray-300 p-2.5 focus:ring-2 focus:ring-amber-500 focus:outline-none" required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                  <input type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} className="w-full rounded-lg border border-gray-300 p-2.5 focus:ring-2 focus:ring-amber-500 focus:outline-none" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full rounded-lg border border-gray-300 p-2.5 focus:ring-2 focus:ring-amber-500 focus:outline-none" required>
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat._id} value={cat._id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full rounded-lg border border-gray-300 p-2.5 focus:ring-2 focus:ring-amber-500 focus:outline-none" rows={3} />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Image (Optional)</label>
                <input type="file" onChange={e => setForm({ ...form, image: e.target.files[0] })} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-amber-100 file:text-amber-700 hover:file:bg-amber-200" />
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-50 mt-4">
                <button type="button" onClick={closeEditModal} className="flex-1 py-2.5 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-xl font-bold shadow-md hover:from-amber-700 hover:to-amber-800 transition-all">Update Product</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
