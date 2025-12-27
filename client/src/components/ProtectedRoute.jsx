// 🛡️ Protected Route Component
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const ProtectedRoute = ({ children, adminOnly = false }) => {
    const { isLoggedin, userData, isLoading } = useContext(AppContext);

    // Show loading while checking auth state
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-amber-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
            </div>
        );
    }

    // Not logged in - redirect to home
    if (!isLoggedin) {
        return <Navigate to="/" replace />;
    }

    // Admin route but user is not admin - redirect to user dashboard
    if (adminOnly && userData?.role !== 'admin') {
        return <Navigate to="/user/dashboard" replace />;
    }

    return children;
};

export default ProtectedRoute;
