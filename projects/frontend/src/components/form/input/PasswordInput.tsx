"use client";

import { useId, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

type Props = {
  id?: string;
  name?: string;
  label?: string;
  placeholder?: string;
  autoComplete?: string; // "current-password" | "new-password" | ...
  className?: string; // เผื่ออยากต่อคลาสเพิ่ม
};

export default function PasswordInput({
  id,
  name = "password",
  label = "Password",
  placeholder,
  autoComplete = "current-password",
  className = "",
}: Props) {
  const reactId = useId();
  const inputId = id ?? `${name}-${reactId}`;
  const [show, setShow] = useState(false);

  return (
    <div className={className}>
      <label htmlFor={inputId} className="text-sm font-bold text-gray-700">
        {label}
      </label>

      <div className="relative mt-1">
        <input
          id={inputId}
          name={name}
          type={show ? "text" : "password"}
          autoComplete={autoComplete}
          required
          placeholder={placeholder}
          className="
            w-full rounded-3xl bg-white border border-black
            px-4 pr-11 py-2.5 text-base
            focus:outline-none focus:ring-2 focus:ring-brand-orange
          "
        />

        {/* ใช้ button เพื่อให้โฟกัส/คีย์บอร์ดได้ และไม่ไป submit ฟอร์ม */}
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          aria-label={show ? "Hide password" : "Show password"}
          className="
            absolute right-3 top-1/2 -translate-y-1/2
            text-gray-600 hover:text-gray-800
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange
          "
        >
          {show ? <FaEye /> : <FaEyeSlash />}
        </button>
      </div>
    </div>
  );
}
