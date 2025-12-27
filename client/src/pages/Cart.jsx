// 🛒 Shopping Cart Page
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AppContext } from '../context/AppContext';
import { assets } from '../assets/assets';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaShoppingCart, FaBox, FaUser, FaSignOutAlt, FaBars, FaTrash, FaMinus, FaPlus } from 'react-icons/fa';
import { HiViewGrid } from 'react-icons/hi';

const Cart = () => {
    const { cartItems, cartTotal, increaseQuantity, decreaseQuantity, removeFromCart, clearCart, getCartForOrder } = useContext(CartContext);
    const { backendUrl, isLoggedin, userData, logout } = useContext(AppContext);
    const navigate = useNavigate();

    const [showCheckout, setShowCheckout] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [shippingAddress, setShippingAddress] = useState({
        fullName: userData?.name || '',
        phone: '',
        address: '',
        city: '',
        postalCode: '',
        notes: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setShippingAddress(prev => ({ ...prev, [name]: value }));
    };

    const handlePlaceOrder = async (e) => {
        e.preventDefault();

        if (!isLoggedin) {
            toast.error("Please login to place an order");
            navigate('/');
            return;
        }

        if (cartItems.length === 0) {
            toast.error("Your cart is empty");
            return;
        }

        setIsSubmitting(true);

        try {
            const orderData = {
                items: getCartForOrder(),
                totalPrice: cartTotal,
                shippingAddress,
                paymentMethod: 'Cash on Delivery'
            };

            const { data } = await axios.post(`${backendUrl}/api/orders`, orderData, {
                withCredentials: true
            });

            if (data.success) {
                toast.success("Order placed successfully!");
                clearCart();
                navigate('/orders');
            } else {
                toast.error(data.message || "Failed to place order");
            }
        } catch (error) {
            console.error("Order error:", error);
            toast.error(error.response?.data?.message || "Failed to place order");
        } finally {
            setIsSubmitting(false);
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
                    {/* Cart Button - Active */}
                    <button
                        className="relative p-2.5 rounded-full bg-amber-100 text-amber-600"
                    >
                        <FaShoppingCart size={20} />
                        {cartItems.length > 0 && (
                            <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold shadow-md">
                                {cartItems.length}
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

                            {/* Cart - Active */}
                            <button
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/30 transition-all"
                            >
                                <FaShoppingCart size={18} />
                                <span className="font-medium">My Cart</span>
                                {cartItems.length > 0 && (
                                    <span className="ml-auto bg-white/20 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                                        {cartItems.length}
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

                {/* 🛒 Main Content */}
                <main className="flex-1 p-4 md:p-6 lg:p-8">
                    {/* Header */}
                    <div className="mb-6">
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-3">
                            <FaShoppingCart className="text-amber-600" />
                            Shopping Cart
                        </h1>
                        <p className="text-gray-500 mt-1">Review your items before checkout</p>
                    </div>

                    {cartItems.length === 0 ? (
                        <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
                            <div className="text-6xl mb-4">🛒</div>
                            <h2 className="text-2xl font-semibold text-gray-600 mb-4">Your cart is empty</h2>
                            <p className="text-gray-500 mb-6">Looks like you haven't added any delicious treats yet!</p>
                            <button
                                onClick={() => navigate('/user/dashboard')}
                                className="px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full font-semibold hover:shadow-lg hover:scale-105 transition-all"
                            >
                                Browse Products
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Cart Items */}
                            <div className="lg:col-span-2 space-y-4">
                                {cartItems.map(item => (
                                    <div key={item._id} className="bg-white rounded-2xl shadow-sm p-4 flex items-center gap-4 border border-gray-100 hover:shadow-md transition-shadow">
                                        <img src={item.image} alt={item.name} className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-xl" />

                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-lg text-gray-800 truncate">{item.name}</h3>
                                            <p className="text-amber-600 font-semibold">Rs. {item.price}</p>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => decreaseQuantity(item._id)}
                                                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-amber-100 flex items-center justify-center text-gray-600 hover:text-amber-600 transition-colors"
                                            >
                                                <FaMinus size={12} />
                                            </button>
                                            <span className="w-10 text-center font-bold text-lg">{item.quantity}</span>
                                            <button
                                                onClick={() => increaseQuantity(item._id)}
                                                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-amber-100 flex items-center justify-center text-gray-600 hover:text-amber-600 transition-colors"
                                            >
                                                <FaPlus size={12} />
                                            </button>
                                        </div>

                                        <div className="text-right">
                                            <p className="font-bold text-lg text-gray-800">Rs. {item.price * item.quantity}</p>
                                            <button
                                                onClick={() => removeFromCart(item._id)}
                                                className="text-red-500 hover:text-red-700 text-sm mt-1 flex items-center gap-1 ml-auto"
                                            >
                                                <FaTrash size={12} />
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                ))}

                                <button
                                    onClick={clearCart}
                                    className="text-red-500 hover:text-red-700 font-medium flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-red-50 transition-colors"
                                >
                                    <FaTrash size={14} />
                                    Clear Cart
                                </button>
                            </div>

                            {/* Order Summary */}
                            <div className="lg:col-span-1">
                                <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-20 border border-gray-100">
                                    <h2 className="text-xl font-bold text-gray-800 mb-4 pb-4 border-b">Order Summary</h2>

                                    <div className="space-y-3 mb-6">
                                        <div className="flex justify-between text-gray-600">
                                            <span>Items ({cartItems.reduce((sum, item) => sum + item.quantity, 0)})</span>
                                            <span>Rs. {cartTotal}</span>
                                        </div>
                                        <div className="flex justify-between text-gray-600">
                                            <span>Delivery</span>
                                            <span className="text-green-600 font-medium">Free</span>
                                        </div>
                                        <div className="flex justify-between text-lg font-bold text-gray-800 pt-3 border-t">
                                            <span>Total</span>
                                            <span className="text-amber-600">Rs. {cartTotal}</span>
                                        </div>
                                    </div>

                                    {!showCheckout ? (
                                        <button
                                            onClick={() => {
                                                if (!isLoggedin) {
                                                    toast.error("Please login to checkout");
                                                    return;
                                                }
                                                setShowCheckout(true);
                                            }}
                                            className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-bold hover:shadow-lg hover:scale-[1.02] transition-all"
                                        >
                                            Proceed to Checkout
                                        </button>
                                    ) : (
                                        <form onSubmit={handlePlaceOrder} className="space-y-4">
                                            <h3 className="font-semibold text-gray-800">Shipping Details</h3>

                                            <input
                                                type="text"
                                                name="fullName"
                                                placeholder="Full Name"
                                                value={shippingAddress.fullName}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none transition-all"
                                            />

                                            <input
                                                type="tel"
                                                name="phone"
                                                placeholder="Phone Number"
                                                value={shippingAddress.phone}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none transition-all"
                                            />

                                            <input
                                                type="text"
                                                name="address"
                                                placeholder="Delivery Address"
                                                value={shippingAddress.address}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none transition-all"
                                            />

                                            <div className="grid grid-cols-2 gap-3">
                                                <input
                                                    type="text"
                                                    name="city"
                                                    placeholder="City"
                                                    value={shippingAddress.city}
                                                    onChange={handleInputChange}
                                                    required
                                                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none transition-all"
                                                />
                                                <input
                                                    type="text"
                                                    name="postalCode"
                                                    placeholder="Postal Code"
                                                    value={shippingAddress.postalCode}
                                                    onChange={handleInputChange}
                                                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none transition-all"
                                                />
                                            </div>

                                            <textarea
                                                name="notes"
                                                placeholder="Delivery Notes (optional)"
                                                value={shippingAddress.notes}
                                                onChange={handleInputChange}
                                                rows={2}
                                                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none transition-all"
                                            />

                                            <div className="bg-amber-50 p-3 rounded-xl text-sm text-amber-800 border border-amber-100">
                                                <p className="font-semibold flex items-center gap-2">
                                                    💵 Payment: Cash on Delivery
                                                </p>
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-bold hover:shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50 disabled:scale-100"
                                            >
                                                {isSubmitting ? 'Placing Order...' : '✓ Place Order'}
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => setShowCheckout(false)}
                                                className="w-full text-gray-600 py-2 hover:text-gray-800 transition-colors"
                                            >
                                                ← Back to Cart
                                            </button>
                                        </form>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Cart;
