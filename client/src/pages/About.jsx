import React from 'react';
import Navbar from '../components/Navbar';
import { assets } from '../assets/assets';

const About = () => {
    return (
        <div className="min-h-screen bg-amber-50">
            <Navbar />

            {/* Hero Section */}
            <div className="relative bg-[#3E2723] text-amber-50 py-20 px-6 overflow-hidden">
                <div className="relative z-10 max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">Baking with Love & Passion</h1>
                    <p className="text-xl text-amber-100/80 leading-relaxed">
                        Since 2025, we've been serving the community with artisanal breads, pastries, and cakes made from the finest ingredients.
                    </p>
                </div>
                {/* Decorative Circle */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-white/5 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl"></div>
            </div>

            <div className="max-w-6xl mx-auto px-6 py-16 space-y-24">

                {/* Our Story */}
                <div className="flex flex-col md:flex-row items-center gap-12">
                    <div className="flex-1 space-y-6">
                        <span className="text-amber-600 font-bold tracking-wider uppercase text-sm">Our Story</span>
                        <h2 className="text-3xl font-bold text-amber-950">From a Small Kitchen to Your Heart</h2>
                        <p className="text-gray-600 leading-relaxed">
                            It all started with a simple belief: bread should be real. No preservatives, no shortcuts. Just flour, water, salt, and patience. What began as a small home kitchen experiment has grown into a beloved local bakery, but our core values remain the same.
                        </p>
                        <p className="text-gray-600 leading-relaxed">
                            Every morning, our bakers arrive before the sun rises to knead, shape, and bake. We believe in the magic of fresh ingredients and the comfort of a warm pastry.
                        </p>
                    </div>
                    <div className="flex-1 w-full h-80 bg-amber-200 rounded-2xl shadow-xl overflow-hidden relative group">
                        <img
                            src={assets.Bakery}
                            alt="Bakery Interior"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                    </div>
                </div>

                {/* Our Values */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { title: "Quality Ingredients", desc: "We source local, organic ingredients whenever possible." },
                        { title: "Handcrafted", desc: "Every loaf and pastry is shaped by hand with care." },
                        { title: "Community First", desc: "We are proud to serve and support our local neighborhood." }
                    ].map((item, idx) => (
                        <div key={idx} className="bg-white p-8 rounded-2xl shadow-md border-b-4 border-amber-500 hover:-translate-y-1 transition-transform">
                            <h3 className="text-xl font-bold text-amber-900 mb-3">{item.title}</h3>
                            <p className="text-gray-600">{item.desc}</p>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
};

export default About;
