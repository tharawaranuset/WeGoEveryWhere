"use client";

import * as React from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Input } from "@/components/ui/input";  // ใช้ Input ที่เรานำเข้ามา

type Props = {
  id?: string;
  name?: string;
  label?: string;
  placeholder?: string;
  autoComplete?: string;
  className?: string;
};

export default function PasswordInput({
  id,
  name = "password",
  label = "Password",
  placeholder,
  autoComplete = "current-password",
  className = "",
}: Props) {
  const reactId = React.useId();
  const inputId = id ?? `${name}-${reactId}`;
  const [show, setShow] = React.useState(false);

  return (
    <div className={className}>
      <label htmlFor={inputId} className="text-sm font-bold text-gray-700">
        {label}
      </label>

      <div className="relative mb-2">
        {/* ใช้ Input ที่มาจาก /components/ui/input */}
        <Input
          id={inputId}
          name={name}
          type={show ? "text" : "password"}
          autoComplete={autoComplete}
          required
          placeholder={placeholder}
          className="w-full rounded-3xl border border-black bg-white px-4 py-2.5 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
        />

        {/* ปุ่มแสดงซ่อนรหัสผ่าน */}
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          aria-label={show ? "Hide password" : "Show password"}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
        >
          {show ? <FaEye /> : <FaEyeSlash />}
        </button>
      </div>
    </div>
  );
}
