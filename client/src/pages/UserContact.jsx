// 🍩 User Contact Page - Dashboard Layout
import React, { useState } from 'react';
import UserLayout from '../components/UserLayout';
import { toast } from 'react-toastify';

const UserContact = () => {
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
        setTimeout(() => {
            toast.success('Message sent! We\'ll get back to you soon.');
            setContactForm({ firstName: '', lastName: '', email: '', message: '' });
            setIsSubmitting(false);
        }, 1000);
    };

    return (
        <UserLayout title="Contact Us">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-amber-900 mb-2">Get in Touch</h1>
                    <p className="text-amber-700/80 max-w-xl mx-auto">
                        We'd love to hear from you! Whether you have a question about our products, an order, or just want to say hello.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Contact Info */}
                    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-amber-100">
                        <h2 className="text-xl font-bold text-amber-800 mb-6 border-b border-amber-100 pb-2">Contact Information</h2>

                        <div className="space-y-5">
                            <div className="flex items-start gap-4">
                                <div className="w-11 h-11 bg-amber-100 rounded-full flex items-center justify-center shrink-0">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-amber-900">Visit Us</h3>
                                    <p className="text-gray-600 text-sm">123 Baker Street<br />Sweet City, CA 90210</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-11 h-11 bg-amber-100 rounded-full flex items-center justify-center shrink-0">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-amber-900">Call Us</h3>
                                    <p className="text-gray-600 text-sm">+1 (123) 456-7890</p>
                                    <p className="text-gray-500 text-xs">Mon - Fri: 8am - 6pm</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-11 h-11 bg-amber-100 rounded-full flex items-center justify-center shrink-0">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-amber-900">Email Us</h3>
                                    <p className="text-gray-600 text-sm">hello@bakerysystem.com</p>
                                </div>
                            </div>
                        </div>

                        {/* Business Hours */}
                        <div className="mt-6 pt-6 border-t border-amber-100">
                            <h3 className="font-semibold text-amber-900 mb-3">Business Hours</h3>
                            <div className="space-y-1 text-sm text-gray-600">
                                <div className="flex justify-between">
                                    <span>Monday - Friday</span>
                                    <span className="font-medium">7:00 AM - 8:00 PM</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Saturday</span>
                                    <span className="font-medium">8:00 AM - 6:00 PM</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Sunday</span>
                                    <span className="font-medium">9:00 AM - 4:00 PM</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-amber-100">
                        <h2 className="text-xl font-bold text-amber-800 mb-6">Send a Message</h2>
                        <form onSubmit={handleContactSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                                    <input
                                        type="text"
                                        value={contactForm.firstName}
                                        onChange={(e) => setContactForm({ ...contactForm, firstName: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-amber-50/50 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                                        placeholder="John"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                                    <input
                                        type="text"
                                        value={contactForm.lastName}
                                        onChange={(e) => setContactForm({ ...contactForm, lastName: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-amber-50/50 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                                        placeholder="Doe"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                                <input
                                    type="email"
                                    value={contactForm.email}
                                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-amber-50/50 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                                    placeholder="john@example.com"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
                                <textarea
                                    rows="4"
                                    value={contactForm.message}
                                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-amber-50/50 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm resize-none"
                                    placeholder="How can we help you?"
                                    required
                                ></textarea>
                            </div>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 rounded-lg font-semibold hover:from-amber-600 hover:to-orange-600 transition-all shadow-md disabled:opacity-50"
                            >
                                {isSubmitting ? 'Sending...' : 'Send Message'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
};

export default UserContact;
