import React, { useState, useContext, useEffect } from 'react';
import { toast } from 'react-toastify';
import { AppContext } from '../context/AppContext';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const UserProfile = () => {
  const { userData, backendUrl, getUserData, setUserData } = useContext(AppContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: ''
  });

  const [isEditing, setIsEditing] = useState(false);

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
    <div className="min-h-screen">
      {/* Top Navbar */}
      <nav className="bg-white shadow p-4 flex justify-between items-center sticky top-0 z-30 w-full">
        <div className="flex items-center space-x-3">
          <img src={assets.LogoImage} alt="Bakery Logo" className="h-10" />
          <h1 className="text-2xl font-bold text-gray-800">Bakery User Profile</h1>
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
        {/* Sidebar */}
        {/* Sidebar */}
        <aside className="w-64 bg-[#5D4037] border-r border-[#795548] text-white min-h-[calc(100vh-64px)] p-4 flex flex-col sticky top-16 transition-all duration-300">

          <div className="mb-6 flex items-center gap-3 pb-4 border-b border-[#795548]">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-600 to-amber-700 flex items-center justify-center font-bold text-sm text-white shadow-lg border border-amber-200">
              {formData.name ? formData.name[0].toUpperCase() : 'U'}
            </div>
            <h2 className="text-lg font-bold tracking-wide">User Panel</h2>
          </div>

          <nav className="flex flex-col gap-2 flex-1">
            <button onClick={() => navigate('/profile')} className="group flex items-center gap-3 p-3 rounded-xl text-amber-50 hover:bg-[#4E342E] hover:text-white transition-all duration-200 text-left">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:scale-105" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              My Profile
            </button>

            <button onClick={() => {
              if (userData?.role === 'admin') {
                navigate('/admin/dashboard');
              } else {
                navigate('/user/dashboard');
              }
            }} className="group flex items-center gap-3 p-3 rounded-xl text-amber-50 hover:bg-[#4E342E] hover:text-white transition-all duration-200 text-left">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:scale-105" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
              {userData?.role === 'admin' ? 'Dashboard' : 'Products'}
            </button>

            <button onClick={() => navigate('/orders')} className="group flex items-center gap-3 p-3 rounded-xl text-amber-50 hover:bg-[#4E342E] hover:text-white transition-all duration-200 text-left">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:scale-105" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
              Orders
            </button>
          </nav>

          <div className="mt-auto border-t border-[#795548] pt-4">
            <button onClick={() => navigate('/')} className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-[#4E342E] text-amber-50 hover:bg-[#3E2723] hover:text-white transition-all duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
              Home Page
            </button>
          </div>
        </aside>

        {/* Main Content */}
        {/* Main Content */}
        <main className="flex-1 bg-amber-50 p-8 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full overflow-hidden border border-amber-100">
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-amber-600 to-orange-500 h-32 relative">
              <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
                <div className="w-24 h-24 rounded-full border-4 border-white bg-white shadow-md overflow-hidden flex items-center justify-center">
                  {/* Placeholder Logic for Image or Initial */}
                  {userData?.image ? (
                    <img src={userData.image} alt="User" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-3xl font-bold text-amber-700">{formData.name ? formData.name[0].toUpperCase() : 'U'}</span>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-16 pb-8 px-8 text-center">
              <h3 className="text-2xl font-bold text-gray-800">{formData.name || 'User Name'}</h3>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 mt-2 uppercase tracking-wide">
                {formData.role}
              </span>
            </div>

            <div className="px-8 pb-8">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-gray-600 font-medium mb-1 text-sm">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-700 ${!isEditing ? 'bg-gray-100 cursor-not-allowed border-gray-200' : 'bg-gray-50 border-gray-300'}`}
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600 font-medium mb-1 text-sm">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-700 ${!isEditing ? 'bg-gray-100 cursor-not-allowed border-gray-200' : 'bg-gray-50 border-gray-300'}`}
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-100 mt-2">
                  {!isEditing ? (
                    <button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="flex-1 bg-amber-600 text-white px-6 py-2.5 rounded-lg hover:bg-amber-700 transition-colors font-medium shadow-md"
                    >
                      Edit Profile
                    </button>
                  ) : (
                    <div className="flex flex-1 gap-4">
                      <button type="submit" className="flex-1 bg-green-600 text-white px-6 py-2.5 rounded-lg hover:bg-green-700 transition-colors font-medium shadow-md">
                        Save Changes
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditing(false);
                          // Reset form data to original user data
                          setFormData({
                            name: userData.name,
                            email: userData.email,
                            role: userData.role || 'user'
                          });
                        }}
                        className="flex-1 bg-gray-500 text-white px-6 py-2.5 rounded-lg hover:bg-gray-600 transition-colors font-medium shadow-md"
                      >
                        Cancel
                      </button>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handleDelete}
                    className="flex-1 bg-white text-red-500 border border-red-200 px-6 py-2.5 rounded-lg hover:bg-red-50 hover:border-red-300 transition-all font-medium"
                  >
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
