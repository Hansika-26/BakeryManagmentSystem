// 📦 User Orders Page
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { CartContext } from '../context/CartContext';
import { assets } from '../assets/assets';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaShoppingCart, FaBox, FaUser, FaSignOutAlt, FaBars, FaCheck, FaTimes, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { HiViewGrid } from 'react-icons/hi';

const Orders = () => {
    const { backendUrl, isLoggedin, userData, logout } = useContext(AppContext);
    const { cartItems, cartCount } = useContext(CartContext);
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    const loadOrders = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/orders/my-orders`, {
                withCredentials: true
            });
            if (data.success) {
                setOrders(data.orders);
            }
        } catch (error) {
            console.error("Failed to load orders:", error);
            toast.error("Failed to load orders");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!isLoggedin) {
            toast.error("Please login to view orders");
            navigate('/');
            return;
        }
        loadOrders();
    }, [isLoggedin]);

    const cancelOrder = async (orderId) => {
        if (!window.confirm("Are you sure you want to cancel this order?")) return;

        try {
            const { data } = await axios.patch(`${backendUrl}/api/orders/${orderId}/cancel`, {}, {
                withCredentials: true
            });
            if (data.success) {
                toast.success("Order cancelled successfully");
                loadOrders();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to cancel order");
        }
    };

    const confirmDelivery = async (orderId) => {
        if (!window.confirm("Confirm that you have received your order?")) return;

        try {
            const { data } = await axios.patch(`${backendUrl}/api/orders/${orderId}/confirm-delivery`, {}, {
                withCredentials: true
            });
            if (data.success) {
                toast.success("Delivery confirmed! Thank you for your order.");
                loadOrders();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to confirm delivery");
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            'Pending': 'bg-yellow-100 text-yellow-800',
            'Confirmed': 'bg-blue-100 text-blue-800',
            'Preparing': 'bg-purple-100 text-purple-800',
            'Out for Delivery': 'bg-indigo-100 text-indigo-800',
            'Delivered': 'bg-green-100 text-green-800',
            'Cancelled': 'bg-red-100 text-red-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
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

                    {/* User Profile */}
                    <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
                        <div className="hidden md:block text-right">
                            <p className="text-sm font-medium text-gray-700">{userData?.name || 'User'}</p>
                            <p className="text-xs text-gray-500">Welcome back!</p>
                        </div>
                        <button
                            onClick={() => navigate('/profile')}
                            className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold shadow-md hover:shadow-lg hover:scale-105 transition-all"
                        >
                            {userData?.name ? userData.name[0].toUpperCase() : 'U'}
                        </button>
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

                            {/* Orders - Active */}
                            <button
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/30 transition-all"
                            >
                                <FaBox size={18} />
                                <span className="font-medium">My Orders</span>
                            </button>

                            {/* Profile */}
                            <button
                                onClick={() => navigate('/profile')}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-amber-100 hover:bg-white/10 hover:text-white transition-all group"
                            >
                                <FaUser size={18} className="group-hover:scale-110 transition-transform" />
                                <span className="font-medium">My Profile</span>
                            </button>
                        </div>

                        {/* Divider */}
                        <div className="my-6 border-t border-white/10"></div>

                        {/* Logout */}
                        <button
                            onClick={logout}
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

                {/* 📦 Main Content */}
                <main className="flex-1 p-4 md:p-6 lg:p-8">
                    {/* Header */}
                    <div className="mb-6">
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-3">
                            <FaBox className="text-amber-600" />
                            My Orders
                        </h1>
                        <p className="text-gray-500 mt-1">Track and manage your orders</p>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-4 border-amber-200 border-t-amber-600"></div>
                        </div>
                    ) : orders.length === 0 ? (
                        <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
                            <div className="text-6xl mb-4">📦</div>
                            <h2 className="text-2xl font-semibold text-gray-600 mb-4">No orders yet</h2>
                            <p className="text-gray-500 mb-6">Start ordering delicious treats from our bakery!</p>
                            <button
                                onClick={() => navigate('/user/dashboard')}
                                className="px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full font-semibold hover:shadow-lg hover:scale-105 transition-all"
                            >
                                Browse Products
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {orders.map(order => (
                                <div key={order._id} className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow">
                                    {/* Order Header */}
                                    <div className="bg-gradient-to-r from-gray-50 to-amber-50 px-4 md:px-6 py-4 flex flex-wrap justify-between items-center gap-4 border-b border-gray-100">
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase tracking-wide">Order ID</p>
                                            <p className="font-mono text-sm text-gray-700">{order._id.slice(-8)}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase tracking-wide">Placed on</p>
                                            <p className="font-medium text-gray-700">{formatDate(order.createdAt)}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase tracking-wide">Total</p>
                                            <p className="font-bold text-amber-600 text-lg">Rs. {order.totalPrice}</p>
                                        </div>
                                        <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </div>

                                    {/* Order Items Preview */}
                                    <div className="p-4 md:p-6">
                                        <div className="flex flex-wrap gap-3 mb-4">
                                            {order.items.slice(0, 3).map((item, index) => (
                                                <div key={index} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3 border border-gray-100">
                                                    <img src={item.image} alt={item.name} className="w-14 h-14 object-cover rounded-lg" />
                                                    <div>
                                                        <p className="font-medium text-gray-800 text-sm">{item.name}</p>
                                                        <p className="text-xs text-gray-500">Qty: {item.quantity} × Rs. {item.price}</p>
                                                    </div>
                                                </div>
                                            ))}
                                            {order.items.length > 3 && (
                                                <div className="flex items-center justify-center w-14 h-20 bg-gray-100 rounded-xl text-gray-500 text-sm font-medium">
                                                    +{order.items.length - 3}
                                                </div>
                                            )}
                                        </div>

                                        {/* Actions */}
                                        <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-100">
                                            <button
                                                onClick={() => setSelectedOrder(selectedOrder === order._id ? null : order._id)}
                                                className="flex items-center gap-2 text-amber-600 hover:text-amber-700 font-medium text-sm px-4 py-2 rounded-lg hover:bg-amber-50 transition-colors"
                                            >
                                                {selectedOrder === order._id ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
                                                {selectedOrder === order._id ? 'Hide Details' : 'View Details'}
                                            </button>
                                            {order.status === 'Pending' && (
                                                <button
                                                    onClick={() => cancelOrder(order._id)}
                                                    className="flex items-center gap-2 text-red-500 hover:text-red-700 font-medium text-sm px-4 py-2 rounded-lg hover:bg-red-50 transition-colors"
                                                >
                                                    <FaTimes size={12} />
                                                    Cancel Order
                                                </button>
                                            )}
                                            {order.status === 'Out for Delivery' && (
                                                <button
                                                    onClick={() => confirmDelivery(order._id)}
                                                    className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:shadow-lg text-white px-4 py-2 rounded-lg font-medium text-sm transition-all"
                                                >
                                                    <FaCheck size={12} />
                                                    Confirm Delivery
                                                </button>
                                            )}
                                        </div>

                                        {/* Expanded Details */}
                                        {selectedOrder === order._id && (
                                            <div className="mt-4 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-100">
                                                {/* Shipping Address */}
                                                <div className="mb-4">
                                                    <p className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                                        📍 Delivery Address
                                                    </p>
                                                    <p className="text-gray-600 text-sm">
                                                        {order.shippingAddress.fullName}, {order.shippingAddress.phone}<br />
                                                        {order.shippingAddress.address}, {order.shippingAddress.city}
                                                        {order.shippingAddress.postalCode && ` - ${order.shippingAddress.postalCode}`}
                                                    </p>
                                                </div>

                                                <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                                    📋 Order Timeline
                                                </h4>
                                                <div className="space-y-2 text-sm">
                                                    <p className="flex items-center gap-2 text-green-600">
                                                        <FaCheck size={12} /> Order Placed: {formatDate(order.createdAt)}
                                                    </p>
                                                    {['Confirmed', 'Preparing', 'Out for Delivery', 'Delivered'].includes(order.status) && (
                                                        <p className="flex items-center gap-2 text-green-600">
                                                            <FaCheck size={12} /> Confirmed by Bakery
                                                        </p>
                                                    )}
                                                    {['Preparing', 'Out for Delivery', 'Delivered'].includes(order.status) && (
                                                        <p className="flex items-center gap-2 text-green-600">
                                                            <FaCheck size={12} /> Being Prepared
                                                        </p>
                                                    )}
                                                    {['Out for Delivery', 'Delivered'].includes(order.status) && (
                                                        <p className="flex items-center gap-2 text-green-600">
                                                            <FaCheck size={12} /> Out for Delivery
                                                        </p>
                                                    )}
                                                    {order.status === 'Delivered' && (
                                                        <p className="flex items-center gap-2 text-green-600">
                                                            <FaCheck size={12} /> Delivered: {order.deliveredAt ? formatDate(order.deliveredAt) : 'Completed'}
                                                        </p>
                                                    )}
                                                    {order.status === 'Cancelled' && (
                                                        <p className="flex items-center gap-2 text-red-500">
                                                            <FaTimes size={12} /> Order Cancelled
                                                        </p>
                                                    )}
                                                    {order.status === 'Pending' && (
                                                        <p className="flex items-center gap-2 text-yellow-600">
                                                            ⏳ Waiting for bakery confirmation
                                                        </p>
                                                    )}
                                                    {order.shippingAddress?.notes && (
                                                        <p className="mt-3 text-gray-600"><span className="font-medium">Notes:</span> {order.shippingAddress.notes}</p>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Orders;
