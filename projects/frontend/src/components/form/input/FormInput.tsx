"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export type FormInputProps = {
  name: string;
  type: string;
  label?: string;
  defaultValue?: string;
  placeholder?: string;
  className?: string;
  readOnly?: boolean;
};

export const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  (
    {
      name,
      type,
      label,
      defaultValue,
      placeholder,
      className = "",
      readOnly = false,
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
          defaultValue={defaultValue}
          readOnly={readOnly}
          className={`
            w-full rounded-3xl border border-black bg-white
            px-4 py-2.5 text-base
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange
            ${className}
          `}
        />
      </div>
    );
  }
);

FormInput.displayName = "FormInput";
