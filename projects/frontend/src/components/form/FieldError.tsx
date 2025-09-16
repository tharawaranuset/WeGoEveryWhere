// /components/form/shared/FieldError.tsx
"use client";
import * as React from "react";

/** แสดง error ใต้ฟิลด์แบบเรียบง่าย */
export function FieldError({ errors }: { errors?: string[] }) {
  if (!errors || errors.length === 0) return null;
  return (
    <p className="pl-5 mt-1 text-[12px] leading-tight text-red-500">
      {errors[0]}
    </p>
  );
}
