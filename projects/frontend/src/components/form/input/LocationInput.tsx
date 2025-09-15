// /components/form/shared/LocationInput.tsx
"use client";
import { MapPin } from "lucide-react";
import { FormInput } from "@/components/form/input/FormInput";

/**
 * อินพุต Location พร้อมไอคอน map pin
 * - ไม่บังคับค่าเริ่มต้น ทุกอย่างเป็น optional
 */
export function LocationInput(props: {
  name?: string;
  label?: string;
  defaultValue?: string;
  value?: string; // เผื่อกรณีคุมด้วย state ภายนอก
  className?: string;
}) {
  const {
    name = "location",
    label = "Location",
    defaultValue,
    value,
    className,
  } = props;

  return (
    <div className="mb-3 relative">
      <FormInput
        name={name}
        type="text"
        label={label}
        defaultValue={defaultValue}
        value={value}
        className={`!bg-[var(--color-brand-background)] rounded-full border-black/30 pr-10 ${
          className ?? ""
        }`}
      />
      <MapPin className="pointer-events-none absolute right-3 top-1/2 translate-y-[5px] h-4 w-4 text-neutral-600" />
    </div>
  );
}
