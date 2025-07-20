import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminSidebar = ({ setActive }) => {
  const navigate = useNavigate();

  return (
    <div className="w-64 bg-[#0e0a22] text-white h-screen p-4">
      <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>
      <ul className="space-y-4">
        <li onClick={() => setActive('add')} className="cursor-pointer hover:text-yellow-400">Add Product</li>
        <li onClick={() => setActive('view')} className="cursor-pointer hover:text-yellow-400">View Products</li>
        <li onClick={() => navigate('')} className="cursor-pointer hover:text-yellow-400">Orders</li>
        <li onClick={() => navigate('/profile')} className="cursor-pointer hover:text-yellow-400">Profile</li>
        <li onClick={() => navigate('/login')} className="cursor-pointer hover:text-yellow-400">Back to Site</li>
      </ul>
    </div>
  );
};

export default AdminSidebar;
