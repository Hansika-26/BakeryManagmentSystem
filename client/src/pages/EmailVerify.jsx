import React, { useContext, useEffect } from 'react'
import { assets } from '../assets/assets'
import axios from 'axios'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'

const EmailVerify = () => {

  axios.defaults.withCredentials = true;

  const { backendUrl, isLoggedin, userData, getUserData } = useContext(AppContext)

  const navigate = useNavigate()

  const inputRefs = React.useRef([])

  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }

  }

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  }

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData('text')
    const pasteArray = paste.split('');
    pasteArray.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
      }
    })

  }

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const otpArray = inputRefs.current.map(e => e.value)
      const otp = otpArray.join('')

      const { data } = await axios.post(backendUrl + '/api/auth/verify-account', { otp }, { withCredentials: true });

      if (data.success) {
        toast.success(data.message)
        getUserData()
        navigate('/')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
        error.message ||
        "Verification failed"
      );
    }
  }

  useEffect(() => {
    isLoggedin && userData && userData.isAccountVerified && navigate('/')

  }, [isLoggedin, userData])

  return (
    <div className='min-h-screen bg-amber-50 flex flex-col'>
      <Navbar />

      <div className='flex-1 flex items-center justify-center px-4 py-12'>
        <form onSubmit={onSubmitHandler} className='bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-amber-100'>
          <h1 className='text-3xl font-bold text-center mb-2 text-amber-900'>Verify Account</h1>
          <p className='text-center mb-8 text-amber-700/80 text-sm'>
            Please enter the 6-digit verification code sent to your email address.
          </p>

          <div className='flex justify-between gap-2 mb-8' onPaste={handlePaste}>
            {Array(6).fill(0).map((_, index) => (
              <input
                type="text"
                maxLength='1'
                key={index}
                required
                className='w-12 h-14 bg-amber-50 border border-amber-200 text-amber-900 text-center text-2xl font-bold rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all'
                ref={e => inputRefs.current[index] = e}
                onInput={(e) => handleInput(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
              />
            ))}
          </div>

          <button className='w-full py-3.5 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-xl font-semibold shadow-md hover:from-amber-700 hover:to-amber-800 transition-all transform hover:scale-[1.01]'>
            Verify Email
          </button>
        </form>
      </div>
    </div>
  )
}

export default EmailVerify
