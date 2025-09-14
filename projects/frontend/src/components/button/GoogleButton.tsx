// src/components/buttons/GoogleButton.tsx
"use client";
import * as React from "react";
import { FcGoogle } from "react-icons/fc";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  onClick?: () => void;
  text?: string;
};
export function GoogleButton({ className, onClick, text = "Continue with Google" }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full py-3 flex items-center justify-center gap-2 rounded-3xl",
        "bg-white text-gray-700 font-bold border border-black",
        "transition duration-150 hover:brightness-105 active:brightness-90 active:scale-95",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-tertiary)]",
        "appearance-none [-webkit-tap-highlight-color:transparent]",
        className
      )}
    >
      <FcGoogle size={22} />
      {text}
    </button>
  );
}
