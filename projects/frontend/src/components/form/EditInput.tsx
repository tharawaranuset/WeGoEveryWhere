// src/components/form/FormInput.tsx
import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = React.ComponentPropsWithoutRef<"input"> & {
  label?: string;
  containerClassName?: string;
};

const FormInput = React.forwardRef<HTMLInputElement, Props>(
  ({ id, name, label, className = "", containerClassName = "", ...props }, ref) => {
    const reactId = React.useId();
    const inputId = id ?? (name ? String(name) : `input-${reactId}`);

    return (
      <div className={`mb-2 ${containerClassName}`}>
        {label && (
          <Label htmlFor={inputId} className="text-sm font-semibold">
            {label}
          </Label>
        )}
        <Input
          ref={ref}
          id={inputId}
          name={name}
          className={`
            mt-1 w-full rounded-3xl border border-black bg-gray-700
            px-4 py-2.5 text-base
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange
            ${className}
          `}
          {...props}
        />
      </div>
    );
  }
);
FormInput.displayName = "FormInput";

export default FormInput;
