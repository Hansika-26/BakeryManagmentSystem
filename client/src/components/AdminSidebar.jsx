import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const AdminSidebar = ({ setActive, activeTab }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Determine active page based on current route
  const isOrdersPage = location.pathname === '/admin/orders';
  const isProductsPage = location.pathname === '/admin/dashboard';

  const getItemClass = (isActive) =>
    `group flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 ${isActive
      ? 'bg-amber-600 text-white shadow-md'
      : 'text-amber-50 hover:bg-[#4E342E] hover:text-white'
    }`;

  return (
    <div className="w-64 bg-[#5D4037] border-r border-[#795548] min-h-screen flex flex-col transition-all duration-300">
      {/* Header / Logo */}
      <div className="p-6 flex items-center gap-3 border-b border-[#795548]">
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-yellow-600 to-amber-700 flex items-center justify-center font-bold text-xl text-white shadow-lg border border-amber-200">
          🍰
        </div>
        <div>
          <h1 className="text-white font-bold text-lg tracking-wide">Admin Panel</h1>
          <p className="text-gray-300 text-xs">BakeMate System</p>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 py-6 px-3">
        <p className="text-amber-300/60 text-xs uppercase font-semibold mb-3 px-3">Products</p>
        <ul className="space-y-2">
          {setActive && (
            <>
              <li onClick={() => setActive('add')} className={getItemClass(isProductsPage && activeTab === 'add')}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="font-medium">Add Product</span>
              </li>

              <li onClick={() => setActive('view')} className={getItemClass(isProductsPage && activeTab === 'view')}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                <span className="font-medium">View Products</span>
              </li>
            </>
          )}

          {!setActive && (
            <li onClick={() => navigate('/admin/dashboard')} className={getItemClass(isProductsPage)}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              <span className="font-medium">Manage Products</span>
            </li>
          )}
        </ul>

        <p className="text-amber-300/60 text-xs uppercase font-semibold mt-6 mb-3 px-3">Orders</p>
        <ul className="space-y-2">
          <li onClick={() => navigate('/admin/orders')} className={getItemClass(isOrdersPage)}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span className="font-medium">Manage Orders</span>
            {isOrdersPage && <span className="ml-auto text-xs bg-white/20 px-2 py-0.5 rounded-full">Active</span>}
          </li>
        </ul>

      </div>

      {/* Admin Info Footer */}
      <div className="p-4 border-t border-[#795548] bg-[#4E342E]">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-full bg-amber-600 flex items-center justify-center text-white font-semibold text-sm">
            A
          </div>
          <div className="flex-1">
            <p className="text-white text-sm font-medium">Admin</p>
            <p className="text-amber-300/60 text-xs">System Manager</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
