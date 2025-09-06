"use client"; 

import { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function PasswordInput() {
  // State และ Logic ทั้งหมดจะถูกเก็บไว้ใน Component นี้
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div>
      <label 
        htmlFor="password" 
        className="text-sm font-bold text-gray-700"
      >
        Password
      </label>
      <div className="relative mt-1">
        <input 
          id="password"
          name="password"
          type={showPassword ? 'text' : 'password'}
          required
          className="w-full p-3 border border-gray-300 rounded-xl focus:ring-brand-orange focus:border-brand-orange"
          // placeholder="กรอกรหัสผ่าน"
        />
        <div 
          onClick={togglePasswordVisibility} 
          className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
        >
          {showPassword ? (
            <FaEye className="text-gray-500" />
          ) : (
            <FaEyeSlash className="text-gray-500" />
          )}
        </div>
      </div>
    </div>
  );
}