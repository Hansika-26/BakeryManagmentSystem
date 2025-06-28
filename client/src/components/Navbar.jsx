import React from 'react'
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom'

const Navbar = () => {

    const navigate = useNavigate()

  return (
    <div className='w-full flex justify-between items-center p-6 sm:p-7 sm:px-22 absolute top-0'>
      <img src={assets.LogoImage} alt="" className='w-38 sm:w-28'/>
      <button onClick={()=>navigate('/login')}
      className='flex items-center gap-2 border border-gray-500 rounded-full px-6 py-2 text-gray-800 hover:bg-gray-100 transition-all'>
        Login <img src={assets.arrow_icon} alt="" />
      </button>
    </div>
  );
};

export default Navbar;
