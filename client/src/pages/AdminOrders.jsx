// 📋 Admin Order Management Page
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { assets } from '../assets/assets';
import axios from 'axios';
import { toast } from 'react-toastify';
import AdminSidebar from '../components/AdminSidebar';

const AdminOrders = () => {
    const { backendUrl, setIsLoggedin, setUserData } = useContext(AppContext);
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState(null);
    const [filterStatus, setFilterStatus] = useState('all');
    const [selectedOrder, setSelectedOrder] = useState(null);

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

    const loadOrders = async () => {
        try {
            console.log("Loading orders from:", `${backendUrl}/api/orders/all`);
            const { data } = await axios.get(`${backendUrl}/api/orders/all`, {
                withCredentials: true
            });
            console.log("Orders API response:", data);
            if (data.success) {
                console.log("Orders loaded:", data.orders?.length || 0);
                setOrders(data.orders || []);
                if (data.orders?.length > 0) {
                    toast.info(`Loaded ${data.orders.length} orders`);
                }
            } else {
                console.log("Orders API returned success:false");
                toast.error("API returned success: false");
                setOrders([]);
            }
        } catch (error) {
            console.error("Failed to load orders:", error.response?.data || error.message);
            toast.error(`Failed: ${error.response?.data?.message || error.message}`);
            setOrders([]); // Set empty array on error so "No orders" shows instead of error
        } finally {
            setLoading(false);
        }
    };

    const loadStats = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/orders/stats/summary`, {
                withCredentials: true
            });
            if (data.success) {
                setStats(data.stats);
            } else {
                // Set default stats if none available
                setStats({ totalOrders: 0, pendingOrders: 0, deliveredOrders: 0, cancelledOrders: 0, totalRevenue: 0 });
            }
        } catch (error) {
            console.error("Failed to load stats:", error);
            setStats({ totalOrders: 0, pendingOrders: 0, deliveredOrders: 0, cancelledOrders: 0, totalRevenue: 0 });
        }
    };

    useEffect(() => {
        loadOrders();
        loadStats();
    }, []);

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            const { data } = await axios.patch(`${backendUrl}/api/orders/${orderId}/status`,
                { status: newStatus },
                { withCredentials: true }
            );
            if (data.success) {
                toast.success(`Order marked as ${newStatus}`);
                loadOrders();
                loadStats();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update order");
        }
    };

    const deleteOrder = async (orderId) => {
        if (!window.confirm("Are you sure you want to delete this order?")) return;

        try {
            const { data } = await axios.delete(`${backendUrl}/api/orders/${orderId}`, {
                withCredentials: true
            });
            if (data.success) {
                toast.success("Order deleted");
                loadOrders();
                loadStats();
            }
        } catch (error) {
            toast.error("Failed to delete order");
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            'Pending': 'bg-yellow-100 text-yellow-800 border-yellow-300',
            'Confirmed': 'bg-blue-100 text-blue-800 border-blue-300',
            'Preparing': 'bg-purple-100 text-purple-800 border-purple-300',
            'Out for Delivery': 'bg-indigo-100 text-indigo-800 border-indigo-300',
            'Delivered': 'bg-green-100 text-green-800 border-green-300',
            'Cancelled': 'bg-red-100 text-red-800 border-red-300'
        };
        return colors[status] || 'bg-gray-100 text-gray-800 border-gray-300';
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

    const filteredOrders = filterStatus === 'all'
        ? orders
        : orders.filter(order => order.status === filterStatus);

    const statusOptions = ['Pending', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'];

    // Valid status transitions for admin (user confirms delivery)
    const getNextStatusOptions = (currentStatus) => {
        const transitions = {
            'Pending': ['Pending', 'Confirmed', 'Cancelled'],
            'Confirmed': ['Confirmed', 'Preparing', 'Cancelled'],
            'Preparing': ['Preparing', 'Out for Delivery', 'Cancelled'],
            'Out for Delivery': ['Out for Delivery', 'Cancelled'], // User confirms delivery
            'Delivered': ['Delivered'],
            'Cancelled': ['Cancelled']
        };
        return transitions[currentStatus] || [currentStatus];
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Streamlined Admin Navbar */}
            <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center sticky top-0 z-30 w-full">
                <div className="flex items-center gap-3">
                    <img src={assets.LogoImage} alt="Bakery Logo" className="h-12 w-12 rounded-full border-2 border-amber-500 shadow-md" />
                </div>

                <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600 hidden md:block">Welcome, Admin</span>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Logout
                    </button>
                </div>
            </nav>

            <div className="flex">
                <AdminSidebar />

                <div className="flex-1 bg-amber-50 p-6 min-h-[calc(100vh-72px)]">
                    {/* Stats Cards */}
                    {stats && (
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                            <div className="bg-white rounded-xl p-4 shadow-md">
                                <p className="text-gray-500 text-sm">Total Orders</p>
                                <p className="text-2xl font-bold text-gray-800">{stats.totalOrders}</p>
                            </div>
                            <div className="bg-yellow-50 rounded-xl p-4 shadow-md border border-yellow-200">
                                <p className="text-yellow-600 text-sm">Pending</p>
                                <p className="text-2xl font-bold text-yellow-700">{stats.pendingOrders}</p>
                            </div>
                            <div className="bg-green-50 rounded-xl p-4 shadow-md border border-green-200">
                                <p className="text-green-600 text-sm">Delivered</p>
                                <p className="text-2xl font-bold text-green-700">{stats.deliveredOrders}</p>
                            </div>
                            <div className="bg-red-50 rounded-xl p-4 shadow-md border border-red-200">
                                <p className="text-red-600 text-sm">Cancelled</p>
                                <p className="text-2xl font-bold text-red-700">{stats.cancelledOrders}</p>
                            </div>
                            <div className="bg-amber-50 rounded-xl p-4 shadow-md border border-amber-200">
                                <p className="text-amber-600 text-sm">Revenue</p>
                                <p className="text-2xl font-bold text-amber-700">Rs. {stats.totalRevenue}</p>
                            </div>
                        </div>
                    )}

                    {/* Filter */}
                    <div className="flex flex-wrap gap-2 mb-6">
                        <button
                            onClick={() => setFilterStatus('all')}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filterStatus === 'all'
                                    ? 'bg-amber-600 text-white'
                                    : 'bg-white text-gray-700 hover:bg-gray-100'
                                }`}
                        >
                            All Orders
                        </button>
                        {statusOptions.map(status => (
                            <button
                                key={status}
                                onClick={() => setFilterStatus(status)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filterStatus === status
                                        ? 'bg-amber-600 text-white'
                                        : 'bg-white text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>

                    {/* Orders List */}
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
                        </div>
                    ) : filteredOrders.length === 0 ? (
                        <div className="bg-white rounded-xl p-12 text-center shadow-md">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                            <p className="text-gray-500 text-lg font-medium mb-2">No orders yet</p>
                            <p className="text-gray-400 text-sm">Orders will appear here when customers place them</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredOrders.map(order => (
                                <div key={order._id} className="bg-white rounded-xl shadow-md overflow-hidden">
                                    {/* Order Header */}
                                    <div className="bg-gray-50 px-6 py-4 flex flex-wrap justify-between items-center gap-4 border-b">
                                        <div className="flex items-center gap-4">
                                            <div>
                                                <p className="text-xs text-gray-500">Order ID</p>
                                                <p className="font-mono text-sm">{order._id.slice(-8)}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Customer</p>
                                                <p className="font-medium">{order.user?.name || order.shippingAddress.fullName}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Date</p>
                                                <p className="text-sm">{formatDate(order.createdAt)}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <div className="text-right">
                                                <p className="text-xs text-gray-500">Total</p>
                                                <p className="font-bold text-amber-600">Rs. {order.totalPrice}</p>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(order.status)}`}>
                                                {order.status}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Order Body */}
                                    <div className="p-6">
                                        {/* Items Preview */}
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {order.items.slice(0, 3).map((item, index) => (
                                                <div key={index} className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                                                    <img src={item.image} alt={item.name} className="w-10 h-10 object-cover rounded" />
                                                    <span className="text-sm">{item.name} ×{item.quantity}</span>
                                                </div>
                                            ))}
                                            {order.items.length > 3 && (
                                                <span className="text-sm text-gray-500 self-center">+{order.items.length - 3} more</span>
                                            )}
                                        </div>

                                        {/* Shipping Address */}
                                        <div className="text-sm text-gray-600 mb-4">
                                            <span className="font-medium">Deliver to:</span> {order.shippingAddress.address}, {order.shippingAddress.city} |
                                            <span className="font-medium"> Phone:</span> {order.shippingAddress.phone}
                                        </div>

                                        {/* Actions */}
                                        <div className="flex flex-wrap items-center gap-3 pt-4 border-t">
                                            {order.status !== 'Delivered' && order.status !== 'Cancelled' && (
                                                <div className="flex items-center gap-2">
                                                    <select
                                                        value={order.status}
                                                        onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                                                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                                                    >
                                                        {getNextStatusOptions(order.status).map(status => (
                                                            <option key={status} value={status}>{status}</option>
                                                        ))}
                                                    </select>
                                                    {order.status === 'Out for Delivery' && (
                                                        <span className="text-xs text-gray-500 italic">User confirms delivery</span>
                                                    )}
                                                </div>
                                            )}

                                            <button
                                                onClick={() => setSelectedOrder(selectedOrder === order._id ? null : order._id)}
                                                className="px-4 py-2 text-amber-600 hover:bg-amber-50 rounded-lg text-sm font-medium"
                                            >
                                                {selectedOrder === order._id ? 'Hide Details' : 'View Details'}
                                            </button>

                                            <button
                                                onClick={() => deleteOrder(order._id)}
                                                className="px-4 py-2 text-red-500 hover:bg-red-50 rounded-lg text-sm font-medium ml-auto"
                                            >
                                                Delete
                                            </button>
                                        </div>

                                        {/* Expanded Details */}
                                        {selectedOrder === order._id && (
                                            <div className="mt-4 p-4 bg-amber-50 rounded-lg">
                                                <h4 className="font-semibold mb-3">Order Details</h4>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-700 mb-2">Items</p>
                                                        {order.items.map((item, index) => (
                                                            <div key={index} className="flex justify-between text-sm py-1">
                                                                <span>{item.name} × {item.quantity}</span>
                                                                <span>Rs. {item.price * item.quantity}</span>
                                                            </div>
                                                        ))}
                                                        <div className="flex justify-between font-bold border-t mt-2 pt-2">
                                                            <span>Total</span>
                                                            <span>Rs. {order.totalPrice}</span>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-700 mb-2">Customer Details</p>
                                                        <p className="text-sm"><span className="font-medium">Name:</span> {order.shippingAddress.fullName}</p>
                                                        <p className="text-sm"><span className="font-medium">Phone:</span> {order.shippingAddress.phone}</p>
                                                        <p className="text-sm"><span className="font-medium">Address:</span> {order.shippingAddress.address}, {order.shippingAddress.city}</p>
                                                        {order.shippingAddress.notes && (
                                                            <p className="text-sm mt-2"><span className="font-medium">Notes:</span> {order.shippingAddress.notes}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminOrders;
