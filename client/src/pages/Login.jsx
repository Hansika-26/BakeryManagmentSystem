import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import Bakery from '../assets/Bakery.avif';

//const backendUrl = import.meta.env.VITE_BACKEND_URL;
// const backendUrl = 'http://localhost:4000';
const Login = () => {

    const navigate = useNavigate()

    const {backendUrl, setIsLoggedin, getUserData} = useContext(AppContext)

    const [state, setState] = useState('Sign Up')
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [role, setRole] = useState('user')

    const onSubmitHandler = async (e) => {
      try {
        e.preventDefault();

        axios.defaults.withCredentials = true

        if(state === 'Sign Up'){
          const {data} = await axios.post(backendUrl + '/api/auth/register', {name, email, password, role})

          if(data.success){
            toast.success("Registration successful! Please log in.");
              setState('Login'); // Switch to login form
              setName('');
              setEmail('');
              setPassword('');
              setRole('user');
            }
          else {
            toast.error(data.message)
          }
        }else {
           try {
            const response = await axios.post(backendUrl + '/api/auth/login', {
              email,
              password,
            });

            if (response.data) {
              toast.success("Login successful!");


                //await getUserData();
                await getUserData(); // fetch user data manually
                setIsLoggedin(true);
                
                
              // Delay navigation to show toast
              setTimeout(() => {
                // Navigate based on user role
                switch (response.data.user.role) {
                  case "admin":
                    navigate("/admin/dashboard");
                    break;
                  case "user":
                    navigate("/");
                    break;
                  default:
                    navigate("/"); // Default fallback
                }
              }, 500);
            }
          } catch (error) {
            if (axios.isAxiosError(error)) {
              const errorMessage = error.response?.data?.msg || "Login failed";
              toast.error(errorMessage);
            } else {
              toast.error("Something went wrong. Please try again.");
            }
            console.error("Login error:", error);
          } 

        }
      }catch(error){
        toast.error(error.message)

      }
    }

  return (
  <div
  className="flex items-center justify-center min-h-screen px-6 sm:px-0 bg-cover bg-center"
  style={{ backgroundImage: `url(${Bakery})` }}
>
      <img onClick={()=>navigate('/')} src={assets.LogoImage} alt="" className='absolute left-5 sm:left-20
      top-5 w-28 sm:w-32 cursor-pointer' />
      <div className='bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm'>
        <h2 className='text-3xl font-semibold text-white text-center mb-3'>{state === 'Sign Up' ? 'Create account' : 'Login' }</h2>
        <p className='text-center text-sm mb-6'>{state === 'Sign Up' ? 'Create your account' : 'Login to your account!' }</p>
      
        <form onSubmit={onSubmitHandler}>
          {state === 'Sign Up' && (
            <>
              <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
                <img src={assets.person_icon} alt=""/>
                <input onChange={e => setName(e.target.value)} value={name}
                className='bg-transparent outline-none' type="text" 
                placeholder="Full Name" required/>
              </div>
              <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
                <select
                  onChange={e => setRole(e.target.value)}
                  value={role}
                  className='bg-transparent outline-none text-white w-full'
                  required
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </>
          )}
          
           <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
            <img src={assets.mail_icon} alt=""/>
            <input onChange={e => setEmail(e.target.value)} value={email}
            className='bg-transparent outline-none' type="email" placeholder="Email id" required/>
          </div>

           <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
            <img src={assets.lock_icon} alt=""/>
            <input onChange={e => setPassword(e.target.value)} value={password}className='bg-transparent outline-none' type="password" placeholder="Password" required/>
          </div>

            <p onClick={()=>navigate('/reset-password')}className='mb-4 text-indigo-500 cursor-pointer'>Forgot password </p>

            <button className='w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 
            text-white font-medium'>{state}</button>
          </form>
            {state === 'Sign Up' ?(<p className='text-gray-400 text-center text-xs mt-4'>Already have an account?{'  '}
              <span onClick={()=> setState('Login')} className='text-blue-400 cursor-pointer underline'>Login here</span>
            </p>
            ) 
            : ( 
            <p className='text-gray-400 text-center text-xs mt-4'>Dont't have an account?{'  '}
              <span onClick={()=> setState('Sign Up')} className='text-blue-400 cursor-pointer underline'>Sing Up</span>
            </p>
          )}
        
      </div>
    </div>
  )
}

export default Login