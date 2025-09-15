// app/page.tsx
"use client";

import { SubmitButton } from "@/components/form/Buttons";
import { GoogleButton } from "@/components/button/GoogleButton";
import { FormInput } from "@/components/form/input/FormInput";
import PasswordInput from "@/components/form/input/PasswordInput";
import Link from "next/link";


export default function LoginPage() {
  return (
    <main className="bg-[var(--color-brand-primary)] font-alt">
      {/* Welcome banner (ชมพู) */}
      <section className="bg-[var(--color-brand-primary)] px-5 pt-6 pb-12 sm:pb-16">
        <p className="text-center text-3xl text-gray-800 font-cursive">
          Welcome to our community!
        </p>
      </section>

      {/* Card Cream + โค้งบนซ้ายแต่งให้เหมือนดีไซน์ */}
      <div className="relative -mt-10 w-full max-w-sm mx-auto flex-1 rounded-t-[50px] bg-[var(--color-brand-secondary)] p-5 shadow-lg border border-black/5
        overflow-hidden pb-24 sm:pb-28 ">
        {/* หัวข้อ */}
        <h2 className="text-4xl font-extrabold text-center text-gray-800 leading-tight mb-2">
          Sign In
        </h2>

        {/* ฟอร์ม: ดันลงเล็กน้อย + ช่องไฟภายในกว้างขึ้น */}
        <form className="mt-4 sm:mt-6 space-y-4 sm:space-y-5">
          <FormInput 
          name="email" 
          label="Email" 
          type="email" 
          placeholder="you@example.com"
          className="bg-white border border-black text-sm placeholder:text-gray-400 placeholder:opacity-100 "
          required
           />

          <PasswordInput
            name="password"
            label="Password"
            placeholder="fill your password"
            autoComplete="current-password"
          />

          <SubmitButton
            text="Log in"
            size="lg"
            className="w-full h-12 px-6
            bg-[#FAB5A7] text-black font-bold border border-black rounded-3xl
            hover:!bg-[#FAB5A7] active:!bg-[#FAB5A7] focus:!bg-[#FAB5A7]
            hover:!brightness-100 active:!brightness-100 active:scale-90
            disabled:opacity-100 transition-none
            focus-visible:outline-none focus-visible:ring-2
            focus-visible:ring-[var(--color-brand-tertiary)]
            appearance-none [-webkit-tap-highlight-color:transparent]"
          />
        </form>

        {/* เส้นคั่น: ลด/เพิ่มนิดหน่อยให้สมดุล */}
        <div className="flex items-center my-5 sm:my-6 text-gray-500">
          <hr className="flex-grow border-gray-300" />
          <span className="mx-4">or</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        {/* ปุ่มด้านล่าง: ช่องไฟพอดีมือ */}
        <div className="space-y-3 sm:space-y-4">
          <Link href="/register" className="block">
            <SubmitButton
              type="button"
              text="Create an account"
              className= "w-full h-12 px-6 bg-[#FFDCD5] text-black font-bold border border-black rounded-3xl hover:!bg-[#FFDCD5] active:!bg-[#FFDCD5] focus:!bg-[#FFDCD5] hover:!brightness-100 active:!brightness-100 active:scale-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-primary)]"
            />
          </Link>

          <GoogleButton onClick={() => {}} />
        </div>

        <a href="#" className="block mt-4 text-center text-sm text-gray-600 hover:underline">
          forgot password
        </a>
      </div>
    </main>
  );
}
