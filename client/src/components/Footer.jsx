import React from 'react';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
    const navigate = useNavigate();

    return (
        <footer className="bg-[#5D4037] text-amber-50 pt-16 pb-8 border-t border-[#795548]">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">

                {/* Brand Section */}
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <img src={assets.LogoImage} alt="Bakery Logo" className="h-12 w-12 rounded-full border-2 border-amber-500" />
                        <h2 className="text-2xl font-bold text-amber-500">Bakery System</h2>
                    </div>
                    <p className="text-amber-100/80 leading-relaxed">
                        Freshly baked happiness delivered to your doorstep. We use the finest ingredients to create memories, one slice at a time.
                    </p>
                </div>

                {/* Quick Links */}
                <div>
                    <h3 className="text-xl font-semibold mb-6 text-white border-b-2 border-amber-600 inline-block pb-2">Quick Links</h3>
                    <ul className="space-y-3">
                        {['Home', 'Products', 'Orders', 'About Us', 'Contact'].map((item) => (
                            <li key={item}>
                                <button
                                    onClick={() => navigate(item === 'Home' ? '/' : `/${item.toLowerCase().replace(' ', '-')}`)}
                                    className="hover:text-amber-400 transition-colors flex items-center gap-2"
                                >
                                    <span className="text-amber-600">›</span> {item}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Contact Info */}
                <div>
                    <h3 className="text-xl font-semibold mb-6 text-white border-b-2 border-amber-600 inline-block pb-2">Contact Us</h3>
                    <div className="space-y-4 text-amber-100/80">
                        <p className="flex items-start gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            123 Baker Street, Sweet City, <br /> CA 90210
                        </p>
                        <p className="flex items-center gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                            +1 (123) 456-7890
                        </p>
                        <p className="flex items-center gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                            hello@bakerysystem.com
                        </p>
                    </div>
                </div>

            </div>

            <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-amber-900/50 text-center text-amber-200/60 text-sm">
                <p>© {new Date().getFullYear()} Bakery Management System. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
