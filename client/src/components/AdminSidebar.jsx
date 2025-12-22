import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminSidebar = ({ setActive }) => {
  const navigate = useNavigate();

  return (

    <div className="w-64 bg-[#5D4037] border-r border-[#795548] min-h-screen flex flex-col transition-all duration-300">
      {/* Header / Logo */}
      <div className="p-6 flex items-center gap-3 border-b border-[#795548]">
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-yellow-600 to-amber-700 flex items-center justify-center font-bold text-xl text-white shadow-lg border border-amber-200">
          A
        </div>
        <div>
          <h1 className="text-white font-bold text-lg tracking-wide">Admin Panel</h1>
          <p className="text-gray-300 text-xs">Management System</p>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 py-6 px-3">
        <ul className="space-y-2">

          <li onClick={() => setActive('add')} className="group flex items-center gap-3 p-3 rounded-xl cursor-pointer text-amber-50 hover:bg-[#4E342E] hover:text-white transition-all duration-200">
            {/* Add Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="font-medium">Add Product</span>
          </li>

          <li onClick={() => setActive('view')} className="group flex items-center gap-3 p-3 rounded-xl cursor-pointer text-amber-50 hover:bg-[#4E342E] hover:text-white transition-all duration-200">
            {/* View Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <span className="font-medium">View Products</span>
          </li>

          <li onClick={() => navigate('')} className="group flex items-center gap-3 p-3 rounded-xl cursor-pointer text-amber-50 hover:bg-[#4E342E] hover:text-white transition-all duration-200">
            {/* Orders Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span className="font-medium">Orders</span>
          </li>

          <div className="my-4 border-t border-[#795548]"></div>

          <li onClick={() => navigate('/profile')} className="group flex items-center gap-3 p-3 rounded-xl cursor-pointer text-amber-50 hover:bg-[#4E342E] hover:text-white transition-all duration-200">
            {/* Profile Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="font-medium">Profile</span>
          </li>

        </ul>
      </div>

      {/* Footer / Back to Site */}
      <div className="p-4 border-t border-[#795548]">
        <button
          onClick={() => navigate('/')}
          className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-[#4E342E] text-amber-50 hover:bg-[#3E2723] hover:text-white transition-all duration-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="font-medium">Back to Website</span>
        </button>
      </div>
    </div>
  );

};

export default AdminSidebar;
