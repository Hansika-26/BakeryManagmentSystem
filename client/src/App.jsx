import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import EmailVerify from './pages/EmailVerify'
import ResetPassword from './pages/ResetPassword'
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard'
import UserProfile from './pages/UserProfile'



const App = () => {
  return (
    <div>
      <ToastContainer/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/login' element={< Login/>}/>
        <Route path='/email-verify' element={<EmailVerify/>}/>
        <Route path='/reset-password' element={<ResetPassword/>}/>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
         <Route path="/user/dashboard" element={<UserDashboard />} />
          <Route path="/profile" element={<UserProfile />} />

      </Routes>
    </div>
  )
}

export default App
