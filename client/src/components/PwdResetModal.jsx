// src/components/PwdResetModal.jsx
import React from 'react';
import { IoMdClose } from "react-icons/io";

const PwdResetModal = ({ showModal, setShowModal }) => {
  if (!showModal) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    // handle password reset logic here
    alert("Reset link sent to your email!");
    setShowModal(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-[90%] max-w-md relative">
        <button
          className="absolute top-2 right-2 text-gray-600 hover:text-black"
          onClick={() => setShowModal(false)}
        >
          <IoMdClose size={22} />
        </button>
        <h2 className="text-xl font-semibold mb-4 text-center">Reset Password</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Enter your email
            </label>
            <input
              type="email"
              id="email"
              required
              className="w-full border border-gray-300 px-3 py-2 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded"
          >
            Send Reset Link
          </button>
        </form>
      </div>
    </div>
  );
};

export default PwdResetModal;
