"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export type FormInputProps = {
  name: string;
  type: React.InputHTMLAttributes<HTMLInputElement>["type"];
  label?: string;
  /** รองรับทั้ง defaultValue (uncontrolled) และ value (controlled) */
  defaultValue?: string | number;
  value?: string | number;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  placeholder?: string;
  className?: string;
  readOnly?: boolean;
  required? : boolean;
};

export const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  (
    {
      name,
      type,
      label,
      defaultValue,
      value,
      onChange,
      placeholder,
      className,
      readOnly = false,
      required = false,
    },
    ref
  ) => {
    const reactId = React.useId();
    const inputId = name || `input-${reactId}`;

    return (
      <div className="mb-2">
        {label && (
          <Label htmlFor={inputId} className="text-sm font-semibold block mb-1">
            {label}
          </Label>
        )}
        <Input
          ref={ref}
          id={inputId}
          name={name}
          type={type}
          placeholder={placeholder}
          // ถ้าให้ value มาก็เป็น controlled; ถ้าไม่ให้ ใช้ defaultValue (uncontrolled)
          {...(value !== undefined ? { value } : { defaultValue })}
          onChange={onChange}
          readOnly={readOnly}
          required = {required}
          className={`
            mt-1 w-full rounded-2xl bg-white border border-black 
            px-4 py-2.5 text-sm focus:border-[#EB6223] focus:outline-none focus:ring-2 focus:ring-[#EB6223]/20"
            ${className ?? ""}
          `}
          required
        />
      </div>
    );
  }
);

FormInput.displayName = "FormInput";
