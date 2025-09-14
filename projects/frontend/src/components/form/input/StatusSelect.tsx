"use client";
import * as React from "react";

/**
 * Native select แบบยืดหยุ่น:
 * - ส่ง options เข้ามาเป็น { value, label }[] ได้ไม่จำกัด
 * - รองรับ controlled (value + onChange) หรือ uncontrolled (defaultValue)
 * - ถ้าอยู่นอก <form> ให้ส่ง formId ด้วย
 * - หมายเหตุ: native dropdown จะ scroll เองเมื่อรายการยาว ไม่สามารถบังคับ "เห็น 5 แถว" ด้วย CSS ได้แบบ cross-browser
 */
export type SelectOption = { value: string; label: string };

export function StatusSelect(props: {
  name?: string;
  label?: string;
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  onChange?: React.ChangeEventHandler<HTMLSelectElement>;
  placeholder?: string; // หากอยากมี option แรกเป็น placeholder
  formId?: string;
  className?: string;
}) {
  const {
    name = "status",
    label = "Status",
    options,
    value,
    defaultValue,
    onChange,
    placeholder,
    formId,
    className,
  } = props;

  const controlled = value !== undefined;

  return (
    <div>
      {label && (
        <label className="mb-1 block text-[13px] font-semibold" htmlFor={name}>
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={name}
          name={name}
          form={formId}
          {...(controlled ? { value } : { defaultValue })}
          onChange={onChange}
          className={`w-full appearance-none rounded-full border border-black/30 
            bg-[var(--color-brand-background)] px-4 py-2 pr-8 outline-none 
            focus-visible:ring-1 focus-visible:ring-offset-0 focus:border-neutral-400 ${
              className ?? ""
            }`}
        >
          {placeholder && (
            <option value="" disabled={controlled}>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* caret */}
        <svg
          className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-700"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" />
        </svg>
      </div>
    </div>
  );
}
