import React, { useState, useContext, useEffect } from 'react';
import { toast } from 'react-toastify';
import { AppContext } from '../context/AppContext';
import { CartContext } from '../context/CartContext';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaShoppingCart, FaBox, FaUser, FaSignOutAlt, FaBars, FaLock, FaEye, FaEyeSlash, FaEdit, FaSave, FaTimes, FaTrash } from 'react-icons/fa';
import { HiViewGrid } from 'react-icons/hi';

const UserProfile = () => {
  const { userData, backendUrl, getUserData, setUserData, setIsLoggedin } = useContext(AppContext);
  const { cartCount } = useContext(CartContext);
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleLogout = async () => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/auth/logout`, {}, { withCredentials: true });
      if (data.success) {
        setIsLoggedin(false);
        setUserData(null);
        toast.success("Logged out successfully");
        navigate('/');
      }
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        axios.defaults.withCredentials = true;
        const { data } = await axios.get(`${backendUrl}/api/user/data`);
        if (data.success) {
          setUserData(data.user);
          setFormData({
            name: data.user.name || '',
            email: data.user.email || '',
            role: data.user.role || 'user'
          });
        }
      } catch (err) {
        toast.error("Failed to load user profile");
      }
    };

    if (!userData || !userData.name) {
      fetchData();
    } else {
      setFormData({
        name: userData.name,
        email: userData.email,
        role: userData.role || 'user'
      });
    }
  }, [userData, setUserData, backendUrl]);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.put(`${backendUrl}/api/user/profile`, {
        name: formData.name,
        email: formData.email
      });

      if (data.success) {
        toast.success("Profile updated successfully!");
        setUserData(data.user);
        setIsEditing(false);
      } else {
        toast.error(data.message || "Profile update failed");
      }
    } catch (err) {
      toast.error("Error updating profile");
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords don't match!");
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.put(`${backendUrl}/api/user/change-password`, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });

      if (data.success) {
        toast.success("Password changed successfully!");
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        setShowPasswordForm(false);
      } else {
        toast.error(data.message || "Password change failed");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error changing password");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete your profile? This cannot be undone.")) {
      try {
        axios.defaults.withCredentials = true;
        const { data } = await axios.delete(`${backendUrl}/api/user/profile`);
        if (data.success) {
          toast.success("Profile deleted successfully");
          setUserData(null);
          navigate('/');
        } else {
          toast.error(data.message || "Failed to delete profile");
        }
      } catch (error) {
        toast.error("Error deleting profile");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      {/* 🌟 Modern Top Navbar */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm px-4 md:px-6 py-3 flex justify-between items-center sticky top-0 z-40 border-b border-amber-100">
        <div className="flex items-center gap-4">
          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="md:hidden p-2 rounded-lg hover:bg-amber-100 text-gray-600 transition-colors"
          >
            <FaBars size={20} />
          </button>

          {/* Logo */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => navigate('/user/dashboard')}
          >
            <img
              src={assets.LogoImage}
              alt="Bakery Logo"
              className="h-12 w-12 md:h-14 md:w-14 rounded-full shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-105"
            />
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Cart Button */}
          <button
            onClick={() => navigate('/cart')}
            className="relative p-2.5 rounded-full hover:bg-amber-100 text-gray-600 hover:text-amber-600 transition-all group"
          >
            <FaShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold shadow-md">
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            )}
          </button>

          {/* User Profile - Active */}
          <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
            <div className="hidden md:block text-right">
              <p className="text-sm font-medium text-gray-700">{userData?.name || 'User'}</p>
              <p className="text-xs text-gray-500">My Profile</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold shadow-md ring-2 ring-amber-200">
              {userData?.name ? userData.name[0].toUpperCase() : 'U'}
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* 📂 Modern Sidebar */}
        <aside className={`${sidebarCollapsed ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed md:static inset-y-0 left-0 z-30 w-64 bg-gradient-to-b from-[#5D4037] to-[#4E342E] text-white min-h-[calc(100vh-65px)] flex flex-col transition-all duration-300 shadow-xl md:shadow-none`}>

          {/* User Card */}
          <div className="p-5 m-4 bg-white/10 backdrop-blur rounded-2xl border border-white/20">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center font-bold text-xl text-white shadow-lg">
                {userData?.name ? userData.name[0].toUpperCase() : '👤'}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-white font-semibold truncate">{userData?.name || 'User'}</h2>
                <p className="text-amber-200/80 text-xs truncate">{userData?.email || 'user@email.com'}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 pb-4">
            <div className="space-y-1">
              {/* Products */}
              <button
                onClick={() => navigate('/user/dashboard')}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-amber-100 hover:bg-white/10 hover:text-white transition-all group"
              >
                <HiViewGrid size={20} className="group-hover:scale-110 transition-transform" />
                <span className="font-medium">Browse Products</span>
              </button>

              {/* Cart */}
              <button
                onClick={() => navigate('/cart')}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-amber-100 hover:bg-white/10 hover:text-white transition-all group"
              >
                <FaShoppingCart size={18} className="group-hover:scale-110 transition-transform" />
                <span className="font-medium">My Cart</span>
                {cartCount > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Orders */}
              <button
                onClick={() => navigate('/orders')}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-amber-100 hover:bg-white/10 hover:text-white transition-all group"
              >
                <FaBox size={18} className="group-hover:scale-110 transition-transform" />
                <span className="font-medium">My Orders</span>
              </button>

              {/* Profile - Active */}
              <button
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/30 transition-all"
              >
                <FaUser size={18} />
                <span className="font-medium">My Profile</span>
              </button>
            </div>

            {/* Divider */}
            <div className="my-6 border-t border-white/10"></div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-300 hover:bg-red-500/20 hover:text-red-200 transition-all group"
            >
              <FaSignOutAlt size={18} className="group-hover:scale-110 transition-transform" />
              <span className="font-medium">Logout</span>
            </button>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-white/10">
            <div className="text-center">
              <p className="text-amber-200/60 text-xs">© 2025 BakeMate</p>
              <p className="text-amber-200/40 text-xs">Fresh Baked with Love</p>
            </div>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {sidebarCollapsed && (
          <div
            className="md:hidden fixed inset-0 bg-black/50 z-20"
            onClick={() => setSidebarCollapsed(false)}
          />
        )}

        {/* 👤 Main Content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 flex items-start justify-center">
          <div className="bg-white rounded-2xl shadow-sm max-w-2xl w-full overflow-hidden border border-gray-100">
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 h-32 relative">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
                <div className="w-24 h-24 rounded-full border-4 border-white bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg overflow-hidden flex items-center justify-center">
                  {userData?.image ? (
                    <img src={userData.image} alt="User" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-4xl font-bold text-white">{formData.name ? formData.name[0].toUpperCase() : 'U'}</span>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-16 pb-6 px-6 md:px-8 text-center">
              <h3 className="text-2xl font-bold text-gray-800">{formData.name || 'User Name'}</h3>
              <span className="inline-block px-4 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 mt-2 uppercase tracking-wide">
                {formData.role}
              </span>
            </div>

            <div className="px-6 md:px-8 pb-8">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-gray-600 font-medium mb-2 text-sm">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 text-gray-700 transition-all ${!isEditing ? 'bg-gray-50 cursor-not-allowed border-gray-200' : 'bg-white border-gray-300'}`}
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600 font-medium mb-2 text-sm">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 text-gray-700 transition-all ${!isEditing ? 'bg-gray-50 cursor-not-allowed border-gray-200' : 'bg-white border-gray-300'}`}
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                {/* Password Change Section */}
                <div className="pt-6 mt-6 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setShowPasswordForm(!showPasswordForm)}
                    className="flex items-center gap-2 text-amber-600 hover:text-amber-700 font-medium text-sm mb-4 px-4 py-2 rounded-lg hover:bg-amber-50 transition-colors"
                  >
                    <FaLock size={14} />
                    {showPasswordForm ? 'Hide Password Change' : 'Change Password'}
                  </button>

                  {showPasswordForm && (
                    <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-6 rounded-xl space-y-4 border border-amber-100">
                      <div>
                        <label className="block text-gray-600 font-medium mb-2 text-sm">Current Password</label>
                        <div className="relative">
                          <input
                            type={showPasswords.current ? "text" : "password"}
                            value={passwordData.currentPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                            className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 bg-white"
                            placeholder="Enter current password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-amber-600 transition-colors"
                          >
                            {showPasswords.current ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-gray-600 font-medium mb-2 text-sm">New Password</label>
                        <div className="relative">
                          <input
                            type={showPasswords.new ? "text" : "password"}
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                            className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 bg-white"
                            placeholder="Enter new password (min 8 characters)"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-amber-600 transition-colors"
                          >
                            {showPasswords.new ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-gray-600 font-medium mb-2 text-sm">Confirm New Password</label>
                        <div className="relative">
                          <input
                            type={showPasswords.confirm ? "text" : "password"}
                            value={passwordData.confirmPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                            className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 bg-white"
                            placeholder="Confirm new password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-amber-600 transition-colors"
                          >
                            {showPasswords.confirm ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                          </button>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handlePasswordChange}
                        className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all font-medium"
                      >
                        Update Password
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100 mt-2">
                  {!isEditing ? (
                    <button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all font-medium"
                    >
                      <FaEdit size={16} />
                      Edit Profile
                    </button>
                  ) : (
                    <div className="flex flex-1 gap-3">
                      <button
                        type="submit"
                        className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all font-medium"
                      >
                        <FaSave size={16} />
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditing(false);
                          setFormData({
                            name: userData.name,
                            email: userData.email,
                            role: userData.role || 'user'
                          });
                        }}
                        className="flex-1 flex items-center justify-center gap-2 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-all font-medium"
                      >
                        <FaTimes size={16} />
                        Cancel
                      </button>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handleDelete}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-white text-red-500 border-2 border-red-200 rounded-xl hover:bg-red-50 hover:border-red-300 transition-all font-medium"
                  >
                    <FaTrash size={14} />
                    Delete Account
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserProfile;
