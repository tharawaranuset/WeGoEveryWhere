// app/page.tsx
"use client";

import Image from 'next/image';
import { FcGoogle } from 'react-icons/fc';
import PasswordInput from './components/password';
import { SubmitButton } from '@/components/form/Buttons';

export default function LoginPage() {
  return (

    <main className="bg-brand-background font-sans">

      <div className="bg-brand-primary">
        <header className="bg-[#FFFBF0] rounded-b-[50px] px-4 py-6 overflow-hidden">
          <div className="flex items-center justify-between">
            <h1 className="text-xl sm:text-2xl font-extrabold leading-none">
              <span className="block text-[#EB6223]">WeGo</span>
              <span className="block text-[#EB6223]">EveryWhere</span>
            </h1>
            <Image src="/images/logo.png" alt="Logo" width={100} height={100} />
          </div>
        </header>
      </div>

      <section className="bg-brand-primary px-5 py-6 pb-10 sm:pb-16">
        <p className="text-center text-3xl text-gray-800 font-cursive">
          Welcome to our community!
        </p>
      </section>

      <div className="bg-[#FFFBF0] rounded-t-[50px] -mt-8 p-6 shadow-lg w-full max-w-sm mx-auto">
        <h2 className="text-4xl font-bold text-center text-gray-800">Sign In</h2>
        
        <form className="mt-5 space-y-6">
          {/* --- ช่องกรอก E-mail --- */}
          <div>
            <label htmlFor="email" className="text-sm font-bold text-gray-700">
              E-mail
            </label>
            <input 
              id="email"
              name="email"
              type="email"
              required
              className="mt-1 w-full p-3 bg-white border border-black rounded-3xl focus:ring-brand-orange focus:border-brand-orange"
            />
          </div>

          <PasswordInput />
          
          <button 
            type="submit"
            className="w-full py-3 bg-[#FAB5A7] text-black font-bold border border-black rounded-3xl
             transition duration-150 hover:brightness-105 active:brightness-90 active:scale-95
             focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange
             appearance-none [-webkit-tap-highlight-color:transparent]"
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
          <button className="w-full py-3 bg-[#FFDCD5] text-black font-bold border border-black rounded-3xl
             transition duration-150 hover:brightness-105 active:brightness-90 active:scale-95
             focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange
             appearance-none [-webkit-tap-highlight-color:transparent]">
            Create an account
          </button>
          <button className="w-full py-3 flex justify-center items-center gap-2 bg-white border border-black text-gray-700 font-bold rounded-3xl hover:bg-gray-50 transition duration-150 hover:brightness-105 active:brightness-90 active:scale-95
             focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange
             appearance-none [-webkit-tap-highlight-color:transparent]">
            <FcGoogle size={22} />
            Continue with Google
          </button>
        </div>

        <a href="#" className="block mt-4 text-center text-sm text-gray-600 hover:underline">
          forgot password
        </a>
      </div>
    </main>
  );
}