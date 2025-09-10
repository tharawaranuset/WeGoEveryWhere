// src/app/(auth)/register/page.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { FaArrowLeft, FaEye, FaEyeSlash } from "react-icons/fa";
import PasswordInput from "../login/components/password";

export default function RegisterPage() {
  return (
    <main className="font-sans">
      {/* แถวบน: แบรนด์ + โลโก้ */}
      <div className="px-5 pt-4">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-extrabold leading-tight">
            <span className="block text-[#EB6223]">WeGo</span>
            <span className="block text-[#EB6223]">EveryWhere</span>
          </h1>
          <Image src="/images/logo.png" alt="Logo" width={100} height={100} />
        </div>

        {/* ปุ่ม Back เล็กๆ ใต้แบรนด์ */}
        <button
          type="button"
          className="mt-3 inline-flex h-8 w-8 items-center justify-center rounded-full border border-black bg-[#EB6223] text-brand-orange active:scale-95 transition"
          aria-label="Back"
          onClick={() => history.back()}
        >
          <FaArrowLeft />
        </button>
      </div>

      <section className="mx-5 mt-3 rounded-t-[44px] bg-[#FFDCD5] px-8 pt-5 pb-8 text-center">
        <h2 className="text-3xl font-bold text-gray-900">Create an account</h2>
      </section>

      {/* การ์ดฟอร์มครีม */}
      <div className="relative z-10 -mt-6 mx-4 rounded-t-[44px] bg-[#FFF8F0] p-5 shadow">
        <form className="space-y-4">
          {/* E-mail */}
          <div>
            <label htmlFor="email" className="text-sm font-semibold">
              E-mail
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              required
              className="mt-1 w-full rounded-3xl border border-black bg-white px-4 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-brand-orange"
            />
          </div>

          {/* Password */}
          <PasswordInput
            name="password"
            label="Password"
            autoComplete="new-password"
          />
          <PasswordInput
            name="confirmPassword"
            label="Confirm Password"
            autoComplete="new-password"
          />

          {/* กล่อง policy เลื่อนในตัว */}
          <div className="mt-2">
            <div className="rounded-3xl bg-[#D7D0D0]/80 p-4 h-36 overflow-auto text-center text-sm font-semibold text-gray-800">
              But if you like causing trouble up in hotel rooms
              And if you like having secret little rendezvous
              If you like to do the things you know that we shouldn't do
              Then, baby, I'm perfect
              Baby, I'm perfect for you
              And if you like midnight driving with the windows down
              And if you like going places we can't even pronounce
              If you like to do whatever you've been dreaming about
              Then, baby, you're perfect
              Baby, you're perfect
              So let's start right now
            </div>
          </div>

          {/* checkbox policy */}
          <label className="mt-2 flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="accept"
              required
              className="size-4 accent-[#F39C12]"
            />
            <span className="font-semibold">i accept the policy</span>
          </label>

          {/* ปุ่ม Next */}
          <button
            type="submit"
            className="mt-1 w-full rounded-3xl border border-black bg-[#FFDCD5] px-4 py-2.5 text-base font-bold text-black transition hover:bg-[#F2C6C6] active:scale-95"
          >
            Next
          </button>
        </form>
      </div>
    </main>
  );
}
