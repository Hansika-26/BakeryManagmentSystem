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
        <aside className="w-64 bg-[#0d0b26] text-white h-[calc(100vh-64px)] p-6 sticky top-16">
          <h2 className="text-xl font-bold mb-4">User Panel</h2>
          <nav className="flex flex-col gap-4 font-medium">
            <button onClick={() => navigate('/profile')} className="text-left hover:bg-green-600 p-2 rounded">Profile</button>
            <button onClick={() => {
                  if (userData?.role === 'admin') {
                    navigate('/admin/dashboard');
                  } else {
                    navigate('/user/dashboard');
                  }
                }} className="text-left hover:bg-green-600 p-2 rounded" >Products
            </button>
            <button onClick={() => navigate('/orders')} className="text-left hover:bg-green-600 p-2 rounded">Orders</button>
            <button onClick={() => navigate('/')} className="text-left hover:bg-green-600 p-2 rounded">Home</button>
            
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 bg-gray-300 p-8 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow max-w-xl w-full space-y-6">
            <div className="flex flex-col items-center">
              <img src={assets.person} alt="User" className="w-28 h-30 rounded-full border-4 object-cover" />
              <h3 className="text-xl font-semibold mt-3 text-gray-800">{formData.name || 'User'}</h3>
              <span className="text-sm text-gray-500">Role: {formData.role}</span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium">Full Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange}
                  className="w-full mt-1 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
              <div>
                <label className="block text-gray-700 font-medium">Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange}
                  className="w-full mt-1 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>

              <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 w-full">Update Profile</button>

              <button
                type="button"
                onClick={handleDelete}
                className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-700 w-full mt-2"
              >
                Delete Profile
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserProfile;
