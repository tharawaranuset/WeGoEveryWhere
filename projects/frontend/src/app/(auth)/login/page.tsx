// app/page.tsx
"use client";

import Image from 'next/image';
import { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import PasswordInput from './components/password';

export default function LoginPage() {
  return (
    // Container หลักของหน้าจอ
    <main className="min-h-screen bg-brand-background font-sans">

      {/* นี่คือกล่องพื้นหลังสีครีม/ชมพูอ่อน */}
      <div className="bg-brand-primary rounded-b-[50px] px-8 pt-2 pb-20">
        {/* ส่วนประกอบภายในกล่องนี้ */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">
            <span className="text-brand-orange">WeGo</span>
            <span className="text-gray-700"> EveryWhere</span>
          </h1>
          <Image 
            src="/images/logo.png" 
            alt="Logo"
            width={60}
            height={60}
          />
          </div>
        <p className="mt-8 text-3xl text-gray-800 font-cursive">
          Welcome to our community!
        </p>
      </div>

      {/* ส่วนฟอร์ม Sign In สีขาว */}
      <div className="bg-white rounded-t-[50px] -mt-10 p-8 shadow-lg w-full max-w-md mx-auto">
        <h2 className="text-4xl font-bold text-center text-gray-800">Sign In</h2>
        
        <form className="mt-8 space-y-6">
          {/* --- ช่องกรอก E-mail --- */}
          <div>
            <label htmlFor="email" className="text-sm font-medium text-gray-700">
              E-mail
            </label>
            <input 
              id="email"
              name="email"
              type="email"
              required
              className="mt-1 w-full p-3 border border-gray-300 rounded-xl focus:ring-brand-orange focus:border-brand-orange"
            />
          </div>

          <PasswordInput />
          
          <button 
            type="submit"
            className="w-full py-3 bg-brand-button text-white font-bold rounded-xl hover:bg-opacity-90 transition"
          >
            Log in
          </button>
        </form>

        <div className="flex items-center my-6">
          <hr className="flex-grow border-gray-300" />
          <span className="mx-4 text-gray-500">or</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        <div className="space-y-4">
          <button className="w-full py-3 bg-white border border-brand-button text-brand-button font-bold rounded-xl hover:bg-gray-50 transition">
            Create an account
          </button>
          <button className="w-full py-3 flex justify-center items-center gap-2 bg-white border border-gray-400 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition">
            <FcGoogle size={22} />
            Continue with Google
          </button>
        </div>

        <a href="#" className="block mt-6 text-center text-sm text-gray-600 hover:underline">
          forgot password
        </a>
      </div>
    </main>
  );
}