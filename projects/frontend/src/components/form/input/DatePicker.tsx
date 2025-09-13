"use client";

import * as React from "react";
import { CalendarIcon } from "lucide-react";

import { Button } from "../../ui/button";
import { Calendar } from "../../ui/calendar";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";

type Calendar28Props = {
  name: string;
  label?: string;
  /** string เช่น "2025-06-01", "June 01, 2025" หรือ "11/12/2025" */
  defaultValue?: string;
  /** ใช้ตั้งค่าเริ่มต้นแบบ Date object */
  initialDate?: Date;
  placeholder?: string;
  readonly?: boolean;
  className?: string;
  required?: boolean;
  /** true = ห้ามพิมพ์ในช่อง input */
  disableTyping?: boolean;
  /** callback เมื่อค่าเปลี่ยน */
  onChange?: (date: Date | undefined, displayText: string) => void;
};

function formatDate(date: Date | undefined) {
  if (!date) return "";
  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

/** พยายาม parse string ให้เป็น Date (รองรับ new Date, และ MM/DD/YYYY แบบง่าย ๆ) */
function parseDateFlexible(value?: string): Date | undefined {
  if (!value) return undefined;

  // 1) ลอง new Date ตรง ๆ (เช่น "June 01, 2025" หรือ "2025-06-01")
  const d1 = new Date(value);
  if (!isNaN(d1.getTime())) return d1;

  // 2) รองรับ "MM/DD/YYYY"
  const mdy = value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (mdy) {
    const m = Number(mdy[1]);
    const d = Number(mdy[2]);
    const y = Number(mdy[3]);
    const d2 = new Date(y, m - 1, d);
    if (!isNaN(d2.getTime())) return d2;
  }

  return undefined;
}

export const Calendar28 = (props: Calendar28Props) => {
  const {
    name,
    label,
    defaultValue,
    initialDate,
    placeholder = "June 01, 2025",
    readonly = false,
    className = "",
    required = false,
    disableTyping = false,
    onChange,
  } = props;

  // init state จาก initialDate ก่อน ถ้าไม่มีค่อยลอง parse defaultValue
  const initDate =
    initialDate && !isNaN(initialDate.getTime())
      ? initialDate
      : parseDateFlexible(defaultValue);

  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(initDate);
  const [month, setMonth] = React.useState<Date | undefined>(initDate);
  const [value, setValue] = React.useState<string>(
    defaultValue ?? formatDate(initDate)
  );

  // ถ้า parent เปลี่ยน initialDate หรือ defaultValue จากภายนอก ให้ sync ตาม
  React.useEffect(() => {
    if (initialDate && !isNaN(initialDate.getTime())) {
      setDate(initialDate);
      setMonth(initialDate);
      setValue(formatDate(initialDate));
      onChange?.(initialDate, formatDate(initialDate));
      return;
    }
    if (typeof defaultValue === "string") {
      setValue(defaultValue);
      const d = parseDateFlexible(defaultValue);
      setDate(d);
      setMonth(d);
      onChange?.(d, defaultValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialDate, defaultValue]);

  const handleSelect = (d?: Date) => {
    setDate(d);
    const display = formatDate(d);
    setValue(display);
    setOpen(false);
    onChange?.(d, display);
  };

  return (
    <div className="mb-2">
      {label && (
        <Label htmlFor={name} className="text-sm font-semibold block mb-1">
          {label}
        </Label>
      )}
      <div className="h-1" />

      <div className="relative">
        <Input
          id={name}
          name={name}
          value={value}
          placeholder={placeholder}
          className={`pr-10 ${className} focus-visible:ring-offset-0 focus-visible:ring-1`}
          readOnly={readonly || disableTyping}
          required={required}
          onChange={(e) => {
            if (readonly || disableTyping) return;
            const raw = e.target.value;
            setValue(raw);
            const d = parseDateFlexible(raw);
            if (d) {
              setDate(d);
              setMonth(d);
            } else {
              setDate(undefined);
            }
            onChange?.(d, raw);
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setOpen(true);
            }
          }}
        />

        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
              aria-label="Select date"
            >
              <CalendarIcon className="size-3.5" />
            </Button>
          </PopoverTrigger>

          <PopoverContent
            className="w-auto overflow-hidden p-3 
             bg-[var(--color-brand-background)] 
             rounded-2xl border border-black/30 
             font-[var(--font-alt)] shadow-lg"
            align="end"
            alignOffset={-8}
            sideOffset={10}
          >
            <Calendar
              mode="single"
              captionLayout="dropdown"
              selected={date}
              month={month}
              onMonthChange={setMonth}
              onSelect={handleSelect}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};
