import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { toast } from 'react-toastify';
import contactImage from '../assets/contact.avif';
import contact from '../assets/Bake.avif';

const Contact = () => {
    const [contactForm, setContactForm] = useState({
        firstName: '', lastName: '', email: '', message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleContactSubmit = (e) => {
        e.preventDefault();
        if (!contactForm.firstName || !contactForm.email || !contactForm.message) {
            toast.error('Please fill in all required fields');
            return;
        }
        setIsSubmitting(true);
        // Simulate sending
        setTimeout(() => {
            toast.success('Message sent! We\'ll get back to you soon.');
            setContactForm({ firstName: '', lastName: '', email: '', message: '' });
            setIsSubmitting(false);
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
            <Navbar />

            {/* Hero Section with Contact Image */}
            <div className="relative pt-20 pb-10 overflow-hidden bg-[#3E2723]">
                <div className="relative max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className="text-center lg:text-left">
                            <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                                Get in <span className="text-orange-400">Touch</span>
                            </h1>
                            <p className="text-xl text-amber-100/90 mb-8 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                                We'd love to hear from you! Whether you have questions about our delicious baked goods, need help with an order, or just want to share your feedback.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border border-white/20">
                                    <span className="text-white font-semibold">📞 011 2883455</span>
                                </div>
                                <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border border-white/20">
                                    <span className="text-white font-semibold">📧 hello@bakerysystem.com</span>
                                </div>
                            </div>
                        </div>
                        <div className="relative mt-10 lg:mt-20">
                            <div className="relative z-10 transform hover:scale-105 transition-transform duration-300">
                                <img
                                    src={contactImage}
                                    alt="Contact Us"
                                    className="w-full h-96 lg:h-[450px] object-cover rounded-3xl shadow-10xl border-4 border-white/30"
                                />
                            </div>
                            {/* Decorative elements */}
                            <div className="absolute -top-4 -right-4 w-24 h-24 bg-orange-400 rounded-full opacity-20 animate-pulse"></div>
                            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-amber-400 rounded-full opacity-30 animate-bounce"></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="pb-16 px-6 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Contact Info */}
                    <div className="bg-white/90 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-amber-100/50 hover:shadow-2xl transition-shadow duration-300">
                        <h2 className="text-3xl font-bold text-amber-800 mb-8 border-b-2 border-amber-200 pb-3">Visit Our Bakery</h2>

                        <div className="space-y-8">
                            <div className="flex items-start gap-6 group">
                                <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-200">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-amber-900 text-lg mb-2">Location</h3>
                                    <p className="text-gray-600 leading-relaxed">123 Baker Street<br />Colombo City, CA 90210<br />Sri Lanka</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-6 group">
                                <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-200">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-amber-900 text-lg mb-2">Phone</h3>
                                    <p className="text-gray-600">011 2883455</p>
                                    <p className="text-gray-500 text-sm mt-1">Mon - Fri: 8am - 6pm<br />Sat - Sun: 9am - 4pm</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-6 group">
                                <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-200">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-amber-900 text-lg mb-2">Email</h3>
                                    <p className="text-gray-600">hello@bakerysystem.com</p>
                                    <p className="text-gray-500 text-sm mt-1">We'll respond within 24 hours</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-white/90 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-amber-100/50 hover:shadow-2xl transition-shadow duration-300">
                        <h2 className="text-3xl font-bold text-amber-800 mb-8">Send us a Message</h2>
                        <form onSubmit={handleContactSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">First Name *</label>
                                    <input
                                        type="text"
                                        value={contactForm.firstName}
                                        onChange={(e) => setContactForm({ ...contactForm, firstName: e.target.value })}
                                        className="w-full px-4 py-3 bg-amber-50/70 border-2 border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                                        placeholder="Enter first name"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name</label>
                                    <input
                                        type="text"
                                        value={contactForm.lastName}
                                        onChange={(e) => setContactForm({ ...contactForm, lastName: e.target.value })}
                                        className="w-full px-4 py-3 bg-amber-50/70 border-2 border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                                        placeholder="Enter last name"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address *</label>
                                <input
                                    type="email"
                                    value={contactForm.email}
                                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                                    className="w-full px-4 py-3 bg-amber-50/70 border-2 border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                                    placeholder="your.email@example.com"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Your Message *</label>
                                <textarea
                                    rows="5"
                                    value={contactForm.message}
                                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                                    className="w-full px-4 py-3 bg-amber-50/70 border-2 border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 resize-none"
                                    placeholder="Tell us how we can help you..."
                                    required
                                ></textarea>
                            </div>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-4 rounded-xl font-bold text-lg hover:from-amber-600 hover:to-orange-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Sending...
                                    </span>
                                ) : (
                                    'Send Message 🍪'
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Right Side Contact Image */}
                    <div className="relative flex items-center justify-center">
                        <div className="relative group">
                            {/* Background decorative elements */}
                            <div className="absolute -inset-4 bg-gradient-to-r from-amber-200 to-orange-200 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
                            <div className="absolute -inset-2 bg-gradient-to-r from-amber-300 to-orange-300 rounded-3xl blur-lg opacity-40 group-hover:opacity-60 transition-opacity duration-500"></div>
                            
                            {/* Main image container */}
                            <div className="relative bg-white/95 backdrop-blur-sm p-6 rounded-3xl shadow-2xl border border-amber-100/50 transform group-hover:scale-105 transition-all duration-500">
                                <div className="relative overflow-hidden rounded-2xl">
                                    <img
                                        src={contact}
                                        alt="Contact Us"
                                        className="w-full h-80 object-cover transform group-hover:scale-110 transition-transform duration-700"
                                    />
                                    {/* Overlay gradient */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                </div>
                                
                                {/* Floating elements */}
                                <div className="absolute -top-3 -right-3 w-8 h-8 bg-orange-400 rounded-full animate-bounce opacity-80"></div>
                                <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-amber-400 rounded-full animate-pulse opacity-60"></div>
                                <div className="absolute top-1/2 -right-1 w-4 h-4 bg-yellow-400 rounded-full animate-ping opacity-70"></div>
                                
                                {/* Text overlay */}
                                <div className="absolute bottom-8 left-8 right-8">
                                    <h3 className="text-white font-bold text-xl mb-1 drop-shadow-lg">Get In Touch</h3>
                                    <p className="text-white/90 text-sm drop-shadow-md">We're here to help with all your baking needs</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
