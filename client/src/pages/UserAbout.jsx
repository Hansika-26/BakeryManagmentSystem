// 🍩 User About Page - Dashboard Layout
import React from 'react';
import UserLayout from '../components/UserLayout';
import { assets } from '../assets/assets';

const UserAbout = () => {
    return (
        <UserLayout title="About Us">
            <div className="max-w-5xl mx-auto">
                {/* Hero Section */}
                <div className="bg-gradient-to-r from-[#5D4037] to-[#4E342E] text-white rounded-2xl p-8 md:p-12 mb-8 relative overflow-hidden">
                    <div className="relative z-10">
                        <h1 className="text-3xl md:text-4xl font-bold mb-4">Baking with Love & Passion</h1>
                        <p className="text-amber-100/90 text-lg max-w-2xl">
                            Since 2025, we've been serving the community with artisanal breads, pastries, and cakes made from the finest ingredients.
                        </p>
                    </div>
                    {/* Decorative circles */}
                    <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white/5 blur-2xl"></div>
                    <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 rounded-full bg-amber-500/10 blur-2xl"></div>
                </div>

                {/* Our Story */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-amber-100">
                        <span className="text-amber-600 font-bold tracking-wider uppercase text-xs">Our Story</span>
                        <h2 className="text-2xl font-bold text-amber-950 mt-2 mb-4">From a Small Kitchen to Your Heart</h2>
                        <div className="space-y-4 text-gray-600 text-sm leading-relaxed">
                            <p>
                                It all started with a simple belief: bread should be real. No preservatives, no shortcuts. Just flour, water, salt, and patience. What began as a small home kitchen experiment has grown into a beloved local bakery, but our core values remain the same.
                            </p>
                            <p>
                                Every morning, our bakers arrive before the sun rises to knead, shape, and bake. We believe in the magic of fresh ingredients and the comfort of a warm pastry.
                            </p>
                        </div>
                    </div>

                    <div className="bg-amber-200 rounded-2xl shadow-xl overflow-hidden">
                        <img
                            src={assets.Bakery}
                            alt="Bakery Interior"
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        />
                    </div>
                </div>

                {/* Our Values */}
                <div className="mb-8">
                    <h2 className="text-xl font-bold text-amber-900 mb-4 text-center">Our Values</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                            {
                                title: "Quality Ingredients",
                                desc: "We source local, organic ingredients whenever possible.",
                                icon: "🌾"
                            },
                            {
                                title: "Handcrafted",
                                desc: "Every loaf and pastry is shaped by hand with care.",
                                icon: "👐"
                            },
                            {
                                title: "Community First",
                                desc: "We are proud to serve and support our local neighborhood.",
                                icon: "🏘️"
                            }
                        ].map((item, idx) => (
                            <div key={idx} className="bg-white p-6 rounded-2xl shadow-md border-b-4 border-amber-500 hover:-translate-y-1 transition-transform">
                                <span className="text-3xl mb-3 block">{item.icon}</span>
                                <h3 className="text-lg font-bold text-amber-900 mb-2">{item.title}</h3>
                                <p className="text-gray-600 text-sm">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Why Choose Us */}
                <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-amber-100">
                    <h2 className="text-xl font-bold text-amber-900 mb-6 text-center">Why Choose BakeMate?</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        {[
                            { value: "1000+", label: "Happy Customers" },
                            { value: "50+", label: "Unique Recipes" },
                            { value: "100%", label: "Fresh Daily" },
                            { value: "24/7", label: "Online Orders" }
                        ].map((stat, idx) => (
                            <div key={idx} className="p-4">
                                <p className="text-2xl md:text-3xl font-bold text-amber-600">{stat.value}</p>
                                <p className="text-gray-600 text-sm mt-1">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </UserLayout>
    );
};

export default UserAbout;
