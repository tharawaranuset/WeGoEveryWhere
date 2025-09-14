// src/app/(auth)/register/page.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { FaArrowLeft, FaEye, FaEyeSlash } from "react-icons/fa";
import PasswordInput from "@/components/form/input/PasswordInput";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { FormInput } from "@/components/form/input/FormInput";
import { toast } from "react-hot-toast";
import { SubmitButton } from "@/components/form/Buttons";
import { useRouter } from "next/navigation";;

export default function RegisterPage() {
  const router = useRouter();
  return (
    <main className="font-alt">
      {/* แถวบน: แบรนด์ + โลโก้ */}
      <div className="px-5 pt-4">
        {/* ปุ่ม Back เล็กๆ ใต้แบรนด์ */}
        <Link
          href="/login"
          aria-label="Back to login"
          className="mt-3 inline-flex h-8 w-8 items-center justify-center rounded-full border border-black
                    bg-[#EB6223] text-black active:scale-95 transition"
        >
          <ArrowLeft size={16} />
        </Link>
      </div>

      <section className="mx-1 mt-2 rounded-t-[44px] bg-[#FFDCD5] px-10 pt-8 pb-12 text-center">
        <h2 className="text-3xl font-bold text-gray-900">Create an account</h2>
      </section>

      {/* การ์ดฟอร์มครีม */}
      <div className="relative -mt-10 w-full max-w-sm mx-auto flex-1 rounded-t-[50px] bg-[var(--color-brand-secondary)] p-5 shadow-lg border border-black/5
        overflow-hidden pb-24 sm:pb-28 ">
        <form className="mt-2 space-y-4"
        onSubmit={(e) => {
          e.preventDefault(); // กัน submit เดิมทุกกรณี
          const form = e.currentTarget as HTMLFormElement & {
            password: HTMLInputElement;
            confirmPassword: HTMLInputElement;
          };
          const pwd = form.password.value;
          const cpw = form.confirmPassword.value;

          if (pwd !== cpw) {
            form.confirmPassword.reportValidity();
            toast.error("password NOT match");
            return;
          }
          form.confirmPassword.setCustomValidity("");
          router.push("/profile_setup");
        }}
        onInput={(e) => {
          const t = e.target as HTMLInputElement;
          if (t.name === "confirmPassword") t.setCustomValidity("");
        }}
        
        >
          {/* E-mail */}
          <FormInput name="email" label="Email" type="email" placeholder="you@example.com" />

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

          <SubmitButton
            text="Next"
            className="
              mt-1 w-full rounded-3xl border border-black
              bg-[#FFDCD5] px-4 py-2.5 text-base font-bold text-black
              hover:!bg-[#FFDCD5] active:!bg-[#FFDCD5] active:!scale-100
              disabled:opacity-100 transition-none
              focus-visible:outline-none focus-visible:ring-2
              focus-visible:ring-[var(--color-brand-tertiary)]
            "
          />
        </form>
      </div>
    </main>
  );
}

