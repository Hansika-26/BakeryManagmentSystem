import React from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import EmailVerify from './pages/EmailVerify'
import ResetPassword from './pages/ResetPassword'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard'
import UserContact from './pages/UserContact'
import UserAbout from './pages/UserAbout'
import UserProfile from './pages/UserProfile'
import Product from './pages/Product'
import Contact from './pages/Contact'
import About from './pages/About'
import Footer from './components/Footer'
import Cart from './pages/Cart'
import Orders from './pages/Orders'
import AdminOrders from './pages/AdminOrders'
import ProtectedRoute from './components/ProtectedRoute'

const App = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isDashboardRoute = ['/user/dashboard', '/user/contact', '/user/about', '/cart', '/orders', '/profile'].includes(location.pathname);
  const hideFooter = isAdminRoute || isDashboardRoute;

  return (
    <div className='flex flex-col min-h-screen'>
      <ToastContainer />
      <div className='flex-grow'>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/email-verify' element={<EmailVerify />} />
          <Route path='/reset-password' element={<ResetPassword />} />

          {/* Admin Protected Routes */}
          <Route path="/admin/dashboard" element={
            <ProtectedRoute adminOnly={true}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/orders" element={
            <ProtectedRoute adminOnly={true}>
              <AdminOrders />
            </ProtectedRoute>
          } />

          {/* User Protected Routes */}
          <Route path="/user/dashboard" element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          } />
          <Route path="/user/contact" element={
            <ProtectedRoute>
              <UserContact />
            </ProtectedRoute>
          } />
          <Route path="/user/about" element={
            <ProtectedRoute>
              <UserAbout />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          } />
          <Route path="/cart" element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          } />
          <Route path="/orders" element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          } />

          {/* Public Routes */}
          <Route path="/product" element={<Product />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
      {!hideFooter && <Footer />}
    </div>
  )
}

export default App
