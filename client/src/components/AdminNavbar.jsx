import React from "react";
import { assets } from "../assets/assets"; // adjust path as needed

const AdminNavbar = () => (
  <nav className="flex items-center justify-between px-8 py-4 bg-white shadow">
    <div className="flex items-center gap-4">
      <img src={assets.LogoImage} alt="Logo" className="w-16 h-16 rounded-full" />
      <span className="text-2xl font-bold text-blue-700">Bakery Admin</span>
    </div>
    <div className="flex gap-6">
      <a href="/admin" className="font-semibold text-gray-700 hover:text-pink-600">Dashboard</a>
      <a href="/orders" className="font-semibold text-gray-700 hover:text-pink-600">Orders</a>
    </div>
  </nav>
);

export default AdminNavbar;